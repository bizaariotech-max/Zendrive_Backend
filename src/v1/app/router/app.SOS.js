const express = require("express");
const router = express.Router();
const { __requestResponse } = require("../../../utils/constent");
const { __SUCCESS, __SOME_ERROR } = require("../../../utils/variable");
const SOS = require("../../../models/SOS");

// 📌 Add or Edit SOS
router.post("/AddEditSOS", async (req, res) => {
    try {
        const { SOSRecordId } = req.body;

        const newData = {
            // not Saved Data
            AssetId: req.body?.AssetId || null,
            StationId: req.body?.StationId || null,
            ReportingAssetId: req.body?.ReportingAssetId || null,
            RouteId: req.body?.RouteId || null,
            ConductorAssetId: req.body?.ConductorAssetId || null,

            // Saved Data
            SOSId: req.body?.SOSId,
            Address: req.body?.Address,
            Geolocation: {
                type: "Point",
                coordinates: [req.body?.Longitude, req.body?.Latitude], // [lng, lat]
            },
        };

        if (!SOSRecordId) {
            await SOS.create(newData);
            return res.json(__requestResponse("200", __SUCCESS));
        }

        await SOS.findByIdAndUpdate(
            SOSRecordId,
            { $set: newData },
            { new: true }
        );

        return res.json(__requestResponse("200", __SUCCESS));
    } catch (error) {
        console.error(error);
        return res.json(
            __requestResponse("500", error.message || __SOME_ERROR)
        );
    }
});

// // 📌 Get All SOS Records
// router.post("/GetSOS", async (req, res) => {
//     try {
//         const list = await SOS.find().populate([
//             { path: "AssetId", select: "Individual.FirstName Individual.LastName Vehicle.RegistrationNumber" },
//             { path: "StationId", select: "StationName" },
//             { path: "ReportingAssetId", select: "Individual.FirstName Individual.LastName" },
//             { path: "RouteId", select: "RouteName" },
//             { path: "ConductorAssetId", select: "Individual.FirstName Individual.LastName" },
//             { path: "SOSId", select: "lookup_value" },
//         ]);

//         return res.json(__requestResponse("200", __SUCCESS, list));
//     } catch (error) {
//         console.error(error.message);
//         return res.json(__requestResponse("500", __SOME_ERROR));
//     }
// });

// // 📌 Delete SOS Record
// router.post("/DeleteSOS", async (req, res) => {
//     try {
//         const { SOSRecordId } = req.body;
//         const record = await SOS.findByIdAndDelete(SOSRecordId);

//         if (record) {
//             return res.json(__requestResponse("200", __SUCCESS));
//         }

//         return res.json(__requestResponse("404", "SOS Record Not found."));
//     } catch (error) {
//         console.error(error.message);
//         return res.json(__requestResponse("500", __SOME_ERROR));
//     }
// });

module.exports = router;
