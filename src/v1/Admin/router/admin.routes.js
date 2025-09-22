const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const { __requestResponse } = require("../../../utils/constent");
const { __SUCCESS, __SOME_ERROR } = require("../../../utils/variable");
const StationMaster = require("../../../models/StationMaster");
const RouteMaster = require("../../../models/RouteMaster");

router.post("/AddEditRoute", async (req, res) => {
    try {
        const { RouteId } = req.body;

        const newData = {
            RouteNumber: req.body?.RouteNumber,
            StationId: req.body?.StationId,
            StartingStationId: req.body?.StartingStationId,
            TerminalStationId: req.body?.TerminalStationId,
            EnrouteStation: req.body?.EnrouteStation,
            DistanceInKMs: req.body?.DistanceInKMs,
            Schedules: req.body?.Schedules,
            DurationInHrsMins: req.body?.DurationInHrsMins,
            IsActive: req.body?.IsActive,
        };
        if (!RouteId) {
            await RouteMaster.create(newData);
            return res.json(__requestResponse("200", __SUCCESS));
        }
        await RouteMaster.findByIdAndUpdate(
            RouteId,
            { $set: newData },
            { new: true }
        );

        return res.json(__requestResponse("200", __SUCCESS));
    } catch (error) {
        console.log(error);
        return res.json(__requestResponse("500", error.message));
    }
});
router.post("/GetRoute", async (req, res) => {
    try {
        const list = await RouteMaster.find().populate([
            {
                path: "StationId StartingStationId TerminalStationId EnrouteStation",
                select: "StationName",
            },
        ]);
        return res.json(__requestResponse("200", __SUCCESS, list));
    } catch (error) {
        console.log(error.message);
        return res.json(__requestResponse("500", __SOME_ERROR));
    }
});
router.post("/DeleteRoute", async (req, res) => {
    try {
        const { RouteId } = req.body;
        const route = await RouteMaster.findByIdAndDelete(RouteId);
        if (route) {
            return res.json(__requestResponse("200", __SUCCESS));
        }
        return res.json(__requestResponse("404", "Route Not found."));
    } catch (error) {
        console.log(error.message);
        return res.json(__requestResponse("500", __SOME_ERROR));
    }
});

module.exports = router;
