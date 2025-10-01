const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const { __requestResponse } = require("../../../utils/constent");
const { __SUCCESS } = require("../../../utils/variable");
const StationMaster = require("../../../models/StationMaster");
const { GetENV } = require("../constant");

router.post("/AddServiceBookingReq", async (req, res) => {
    try {
        // env  - VEHICLE_INSPECTION , VEHICLE_SERVICE
        if (!req.body.ServiceType) {
            return res.json(
                __requestResponse("400", "Please Select Service Type")
            );
        }

        const ServiceType = await GetENV(req.body.ServiceType);
        const newData = {
            ServiceTypeId: ServiceType?.EnvSettingValue,
            AssetId: req.body?.AssetId || null,
            Date: req.body?.Date,
            Time: req.body?.Time,
            Comments: req.body?.Comments,
            PickUpRequired: req.body?.PickUpRequired || false,
            HomeVisit: req.body?.HomeVisit || false,
            AddressLine1: req.body?.AddressLine1,
            AddressLine2: req.body?.AddressLine2,
            StateId: req.body?.StateId,
            CityId: req.body?.CityId,
            PostalCode: req.body?.PostalCode,
            Acknowledged: req.body?.Acknowledged || false,
            Status: req.body?.Status,
        };
        await StationMaster.create(newData);
        return res.json(__requestResponse("200", __SUCCESS));
    } catch (error) {
        console.log(error);
        return res.json(__requestResponse("500", error.message));
    }
});

module.exports = router;
