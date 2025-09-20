const express = require("express");
const router = express.Router();
const { __requestResponse } = require("../../../utils/constent");
const { __SUCCESS, __SOME_ERROR } = require("../../../utils/variable");
const DutyAllocation = require("../../../models/DutyAllocation");

router.post("/AddEditDutyAllocation", async (req, res) => {
    try {
        const { DutyAllocationId } = req.body;

        const newData = {
            RouteId: req.body?.RouteId,
            DateOfTrip: req.body?.DateOfTrip,
            StartTimeOfTrip: req.body?.StartTimeOfTrip,
            VehicleId: req.body?.VehicleId,
            DriverId: req.body?.DriverId,
            ConductorId: req.body?.ConductorId,
        };
        if (!DutyAllocationId) {
            await DutyAllocation.create(newData);
            return res.json(__requestResponse("200", __SUCCESS));
        }
        await DutyAllocation.findByIdAndUpdate(
            DutyAllocationId,
            { $set: newData },
            { new: true }
        );

        return res.json(__requestResponse("200", __SUCCESS));
    } catch (error) {
        console.log(error);
        return res.json(__requestResponse("500", error.message));
    }
});
router.post("/GetDutyAllocation", async (req, res) => {
    try {
        const list = await DutyAllocation.find().populate([
            {
                path: "VehicleId DriverId ConductorId",
                select: "Individual.FirstName Individual.LastName Vehicle.RegistrationNumber",
            },
            {
                path: "RouteId",
                populate: {
                    path: "StationId StartingStationId TerminalStationId EnrouteStation",
                    select: "StationName",
                },
            },
        ]);
        return res.json(__requestResponse("200", __SUCCESS, list));
    } catch (error) {
        console.log(error.message);
        return res.json(__requestResponse("500", __SOME_ERROR));
    }
});
router.post("/DeleteDutyAllocation", async (req, res) => {
    try {
        const { DutyAllocationId } = req.body;
        const list = await DutyAllocation.findByIdAndDelete(DutyAllocationId);
        if (list) {
            return res.json(__requestResponse("200", __SUCCESS));
        }
        return res.json(__requestResponse("404", "Duty Allocation Not found."));
    } catch (error) {
        console.log(error.message);
        return res.json(__requestResponse("500", __SOME_ERROR));
    }
});

module.exports = router;
