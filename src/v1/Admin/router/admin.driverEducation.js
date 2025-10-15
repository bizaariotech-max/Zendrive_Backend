const express = require("express");
const router = express.Router();
const { __requestResponse } = require("../../../utils/constent");
const { __SUCCESS, __SOME_ERROR } = require("../../../utils/variable");
const DriverEducation = require("../../../models/DriverEducation");

// 📌 Add or Edit Driver Education
router.post("/AddEditDriverEducation", async (req, res) => {
    try {
        const { DriverEducationId } = req.body;

        const newData = {
            Title: req.body?.Title,
            ShortDescription: req.body?.ShortDescription,
            LongDescription: req.body?.LongDescription,
            VideoURL: req.body?.VideoURL || null,
            ReferenceLinks: req.body?.ReferenceLinks || [],
        };

        // 🆕 Create new record
        if (!DriverEducationId) {
            await DriverEducation.create(newData);
            return res.json(__requestResponse("200", __SUCCESS));
        }

        // ✏️ Update existing record
        await DriverEducation.findByIdAndUpdate(
            DriverEducationId,
            { $set: newData },
            { new: true }
        );

        return res.json(__requestResponse("200", __SUCCESS));
    } catch (error) {
        console.error("AddEditDriverEducation Error:", error);
        return res.json(
            __requestResponse("500", error.message || __SOME_ERROR)
        );
    }
});

// 📋 List Driver Education (All)
router.get("/ListDriverEducation", async (req, res) => {
    try {
        const data = await DriverEducation.find()
            // .sort({ createdAt: -1 }) // latest first
            .lean();

        return res.json(__requestResponse("200", __SUCCESS, data));
    } catch (error) {
        console.error("ListDriverEducation Error:", error);
        return res.json(
            __requestResponse("500", error.message || __SOME_ERROR)
        );
    }
});

module.exports = router;
