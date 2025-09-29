const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const { __uploadImage } = require("../../../utils/multer");
const AdminEnvSetting = require("../../../models/AdminEnvSetting");
const { __requestResponse, __deleteFile } = require("../../../utils/constent");
const { __SUCCESS, __SOME_ERROR } = require("../../../utils/variable");
const { default: axios } = require("axios");

// for image and pdf both - for pdf it will save pdf in server folder /uploads --- working API
router.post("/AddImage", __uploadImage, async (req, res) => {
    try {
        if (!req.files || !req.files.file || req.files.file.length === 0) {
            return res.json(__requestResponse("400", "No files uploaded"));
        }

        const __ImagePathDetails = await AdminEnvSetting.findOne({
            EnvSettingCode: "IMAGE_PATH",
        });

        const uploadedFiles = [];

        for (const file of req.files.file) {
            const filePath = path.resolve("./uploads/" + file.filename);
            const ext = path.extname(file.originalname).toLowerCase();

            if (ext === ".pdf") {
                //  Store PDF locally
                uploadedFiles.push({
                    filename: file.filename,
                    file_type: "pdf",
                    full_URL:
                        process.env.NODE_ENV === "development"
                            ? `${process.env.LOCAL_IMAGE_URL}/uploads/${file.filename}`
                            : `${__ImagePathDetails?.EnvSettingTextValue}/uploads/${file.filename}`,
                    base_URL:
                        process.env.NODE_ENV === "development"
                            ? process.env.LOCAL_IMAGE_URL
                            : __ImagePathDetails?.EnvSettingTextValue,
                });
            } else {
                // Upload image/video to Cloudinary
                const result = await cloudinary.uploader.upload(filePath, {
                    folder: "event_assets", // You can change to "event_images" or "event_videos" based on `file.mimetype`
                    resource_type: "auto",
                });

                __deleteFile(filePath); // cleanup local copy

                uploadedFiles.push({
                    filename: file.filename,
                    file_type: file.mimetype.startsWith("video/")
                        ? "video"
                        : "image",
                    public_id: result.public_id,
                    full_URL: result.secure_url,
                    base_URL:
                        process.env.NODE_ENV === "development"
                            ? process.env.LOCAL_IMAGE_URL
                            : __ImagePathDetails?.EnvSettingTextValue,
                });
            }
        }

        return res.json(__requestResponse("200", __SUCCESS, uploadedFiles));
    } catch (error) {
        console.error("Upload Error:", error);
        return res.json(__requestResponse("500", __SOME_ERROR));
    }
});

// not working
router.get("/RenderDocx/:filename", async (req, res) => {
    const { filename } = req.params;

    // Cloudinary base URL (adjust as per your actual path structure)
    const fullURL = `https://res.cloudinary.com/dirwzvugj/raw/upload/tripexplore_docs/${filename}`;

    try {
        const response = await axios({
            url: fullURL,
            method: "GET",
            responseType: "stream",
        });

        // Set appropriate headers to display the PDF inline
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline; filename=" + filename);
        console.warn(response);
        // Pipe the Cloudinary PDF stream to the response
        response.data.pipe(res);
    } catch (error) {
        console.error("Cloudinary Fetch Error:", error?.message || error);
        return res.json({
            response: {
                response_code: "500",
                response_message: "Failed to fetch PDF from Cloudinary",
            },
        });
    }
});

// for pdf rendering from /uploads folder
router.get("/RenderDoc/uploads/:filename", async (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.resolve("./uploads", filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                response: {
                    response_code: "404",
                    response_message: "File not found",
                },
            });
        }

        // Set content type based on file extension
        const ext = path.extname(filename).toLowerCase();
        const mimeTypes = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".gif": "image/gif",
            ".pdf": "application/pdf",
            ".mp4": "video/mp4",
        };

        res.setHeader(
            "Content-Type",
            mimeTypes[ext] || "application/octet-stream"
        );
        fs.createReadStream(filePath).pipe(res);
    } catch (error) {
        console.error("Render Error:", error);
        res.status(500).json({
            response: {
                response_code: "500",
                response_message: "Failed to render file",
            },
        });
    }
});

module.exports = router;
