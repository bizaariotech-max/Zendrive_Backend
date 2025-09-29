const express = require("express");
const router = express.Router();
const { __requestResponse } = require("../../../utils/constent");
const { __SUCCESS, __SOME_ERROR } = require("../../../utils/variable");
const RoadAccident = require("../../../models/ReportRoadAccident");

// 📌 Create Road Accident Report
router.post("/AddRoadAccident", async (req, res) => {
    try {
        console.log(req.body);

        const newData = {
            Geolocation: {
                type: "Point",
                coordinates: [req.body?.latitude, req.body?.longitude], // Expect [lng, lat]
            },
            AccidentTypeIds: req.body?.accidentType,
            VehicleTypesInvolvedIds: req.body?.vehicleType,
            ApproximateNoOfVictims: req.body?.noOfVictims,
            VisibleInjuryTypes: req.body?.injuryType,
            FatalityNo: req.body?.anyFatality,
            VehicleInvolved: req.body?.vehicleList.map((item) => ({
                VehicleType: item?.TypeId,
                RegistrationNumber: item?.RegisrationNumber,
                PicturePfNumberPlate: item?.PictureOfNumberPlate,
            })),
            VictimNumber: req.body?.contactOfConsiousVictim,
            VictimDetails: req.body?.victimlist.map((item) => ({
                IdCardType: item?.TypeId,
                IdNumber: item?.IdNumber,
                IdPicture: item?.PictureOfId,
            })),
            AccidentSitesPicture: req.body?.accidentSites,
            AccidentVictimsPicture: req.body?.accidentVictims,
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
