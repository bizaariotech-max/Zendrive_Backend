const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const { __requestResponse } = require("../../../utils/constent");
const { __SUCCESS, __SOME_ERROR } = require("../../../utils/variable");
const StationMaster = require("../../../models/StationMaster");
const AssetMaster = require("../../../models/AssetMaster");

// Add / Edit Asset
router.post("/AddEditAsset", async (req, res) => {
    try {
        const { AssetId } = req.body;

        const newData = {
            AssetTypeId: req.body?.AssetTypeId,
            StationId: req.body?.StationId,
            Individual: req.body?.Individual || {},
            Vehicle: req.body?.Vehicle || {},
            IsActive: req.body?.IsActive,
        };

        if (!AssetId) {
            await AssetMaster.create(newData);
            return res.json(__requestResponse("200", __SUCCESS));
        }

        await AssetMaster.findByIdAndUpdate(
            AssetId,
            { $set: newData },
            { new: true }
        );

        return res.json(__requestResponse("200", __SUCCESS));
    } catch (error) {
        console.error(error);
        return res.json(__requestResponse("500", error.message));
    }
});

// Get Asset List
router.post("/GetAssets", async (req, res) => {
    try {
        const list = await AssetMaster.find()
            .populate([
                { path: "AssetTypeId", select: "lookup_value" },
                { path: "StationId", select: "StationName" },
                { path: "Individual.ReportingTo" },
                { path: "Individual.DepartmentId", select: "lookup_value" },
                { path: "Individual.DesignationId", select: "lookup_value" },
                { path: "Vehicle.MakeId", select: "lookup_value" },
                { path: "Vehicle.VehicleModelId", select: "lookup_value" },
                { path: "Vehicle.FuelTypeId", select: "lookup_value" },
                { path: "Vehicle.ColorId", select: "lookup_value" },
            ])
            .lean();

        return res.json(__requestResponse("200", __SUCCESS, list));
    } catch (error) {
        console.error(error.message);
        return res.json(__requestResponse("500", __SOME_ERROR));
    }
});
// Delete Asset
router.post("/DeleteAsset", async (req, res) => {
    try {
        const { AssetId } = req.body;
        const asset = await AssetMaster.findByIdAndDelete(AssetId);

        if (asset) {
            return res.json(__requestResponse("200", __SUCCESS));
        }
        return res.json(__requestResponse("404", "Asset not found."));
    } catch (error) {
        console.error(error.message);
        return res.json(__requestResponse("500", __SOME_ERROR));
    }
});

module.exports = router;
