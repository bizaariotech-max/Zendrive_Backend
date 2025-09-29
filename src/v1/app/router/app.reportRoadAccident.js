const express = require("express");
const router = express.Router();
const { __requestResponse } = require("../../../utils/constent");
const { __SUCCESS, __SOME_ERROR } = require("../../../utils/variable");
const RoadAccident = require("../../../models/ReportRoadAccident");

// 📌 Create Road Accident Report
router.post("/AddRoadAccident", async (req, res) => {
    try {
        const newData = {
            Geolocation: {
                type: "Point",
                coordinates: [req.body?.Longitude, req.body?.Latitude], // Expect [lng, lat]
            },
            AccidentTypeId: req.body?.AccidentTypeId,
            VehicleTypesInvolvedId: req.body?.VehicleTypesInvolvedId,
            ApproximateNoOfVictims: req.body?.ApproximateNoOfVictims,
            VisibleInjuryTypes: req.body?.VisibleInjuryTypes,
            FatalityNo: req.body?.FatalityNo,
            VehicleInvolved: req.body?.VehicleInvolved,
            VictimNumber: req.body?.VictimNumber,
            VictimDetails: req.body?.VictimDetails,
            AccidentSitesPicture: req.body?.AccidentSitesPicture,
            AccidentVictimsPicture: req.body?.AccidentVictimsPicture,
        };

        await RoadAccident.create(newData);
        return res.json(__requestResponse("200", __SUCCESS));
    } catch (error) {
        console.error(error);
        return res.json(
            __requestResponse("500", error.message || __SOME_ERROR)
        );
    }
});

module.exports = router;
