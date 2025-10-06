const express = require("express");
const router = express.Router();
const { __requestResponse } = require("../../../utils/constent");
const { __SUCCESS, __SOME_ERROR } = require("../../../utils/variable");
const IncidentMaster = require("../../../models/IncidentMaster");
const { GetENV } = require("../constant");

// 📌 Get All Incidents
router.post("/GetIncident", async (req, res) => {
    try {
        // CHALLAN_&_ACCIDENT
        const filter = {};
        if (req.body.DriverId) {
            filter.DriverId = req.body.DriverId;
        }
        if (req.body.IncidentType) {
            const IncidentIdsList = await GetENV(
                req.body.IncidentType,
                "multi"
            );
            if (IncidentIdsList.length == 0) {
                return res.json(
                    __requestResponse("400", "Incident Ids not found")
                );
            }
            filter.IncidentTypeId = IncidentIdsList.map(
                (i) => i.EnvSettingValue
            );
        }

        const list = await IncidentMaster.find(filter).populate([
            {
                path: "IncidentTypeId ViolationTypeId CauseofAccident",
                select: "lookup_value",
            },
            { path: "StationId", select: "StationName" },
            {
                path: "RouteId",
                populate: {
                    path: "StationId StartingStationId TerminalStationId EnrouteStation",
                    select: "StationName",
                },
            },
            { path: "VehicleId", select: "Vehicle.RegistrationNumber" },
            {
                path: "DriverId ConductorId",
                select: "Individual.FirstName Individual.LastName Individual.DLNumber",
            },
        ]);

        return res.json(__requestResponse("200", __SUCCESS, list));
    } catch (error) {
        console.log(error.message);
        return res.json(__requestResponse("500", __SOME_ERROR));
    }
});

module.exports = router;
