const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const { __requestResponse } = require("../../../utils/constent");
const { __SUCCESS, __SOME_ERROR } = require("../../../utils/variable");
const StationMaster = require("../../../models/StationMaster");
const AssetMaster = require("../../../models/AssetMaster");
const { GetLookup, GetENV } = require("../../app/constant");

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
            if (req.body?.Vehicle?.RegistrationNumber) {
                const check = await AssetMaster.findOne({
                    "Vehicle.RegistrationNumber":
                        req.body?.Vehicle?.RegistrationNumber,
                });
                if (check) {
                    return res.json(
                        __requestResponse(
                            "400",
                            "Vehical With This Registration Number Already Exist"
                        )
                    );
                }
            }
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
        const assetType = req.body.assetType;

        // Individual ,Vehicle
        const AssetTypeIds = await GetLookup(
            "asset_type",
            assetType == "Individual"
                ? "68cb9812d425cf3422d58d1c"
                : "68cb9812d425cf3422d58d1d"
        );
        const list = await AssetMaster.find(
            assetType
                ? {
                      AssetTypeId: {
                          $in: AssetTypeIds.map((item) => item?._id),
                      },
                  }
                : {}
        )
            .populate([
                { path: "AssetTypeId", select: "lookup_value" },
                { path: "StationId", select: "StationName" },
                { path: "Individual.ReportingTo" },
                { path: "Individual.DepartmentId", select: "lookup_value" },
                { path: "Individual.DesignationId", select: "lookup_value" },
                { path: "Vehicle.VehicalTypeId", select: "lookup_value" },
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

router.post("/GetAssetsDropDown", async (req, res) => {
    try {
        // {
        //     "assetType":"Vehicle",
        //     "stationId":"68cb9812d425cf3422d58d1d",
        // }
        const assetType = req.body.AssetType;
        const stationId = req.body.StationId;

        if (!assetType) {
        }

        const AssetTypeIds = await GetENV(assetType);
        console.log(AssetTypeIds);

        const filter = {};
        if (assetType) {
            filter.AssetTypeId = AssetTypeIds?.EnvSettingValue;
        }
        if (stationId) {
            filter.StationId = stationId;
        }
        console.log(filter);

        const list = await AssetMaster.find(
            filter,
            "Individual.FirstName Individual.LastName Individual.DLNumber Vehicle.RegistrationNumber"
        );

        return res.json(__requestResponse("200", __SUCCESS, list));
    } catch (error) {
        console.error(error.message);
        return res.json(__requestResponse("500", __SOME_ERROR));
    }
});

module.exports = router;
