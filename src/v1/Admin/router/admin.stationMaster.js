const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const { __requestResponse } = require("../../../utils/constent");
const { __SUCCESS, __SOME_ERROR } = require("../../../utils/variable");
const StationMaster = require("../../../models/StationMaster");

router.post("/AddEditStation", async (req, res) => {
    try {
        const { StationId } = req.body;

        const newData = {
            StationTypeId: req.body?.StationTypeId,
            ParentStationId: req.body?.ParentStationId,
            StationName: req.body?.StationName,
            AddressLine1: req.body?.AddressLine1,
            AddressLine2: req.body?.AddressLine2,
            QuestionType: req.body?.QuestionType,
            PostalCode: req.body?.PostalCode,
            StateId: req.body?.StateId,
            CityId: req.body?.CityId,
            Geolocation: req.body?.Geolocation,
            IsActive: req.body?.IsActive,
        };
        if (!StationId) {
            await StationMaster.create(newData);
            return res.json(__requestResponse("200", __SUCCESS));
        }
        await StationMaster.findByIdAndUpdate(
            StationId,
            { $set: newData },
            { new: true }
        );

        return res.json(__requestResponse("200", __SUCCESS));
    } catch (error) {
        console.log(error);
        return res.json(__requestResponse("500", error.message));
    }
});
router.post("/GetStation", async (req, res) => {
    try {
        const list = await StationMaster.find().populate([
            {
                path: "StationTypeId StateId CityId",
                select: "lookup_value",
            },
            {
                path: "ParentStationId",
                select: "StationName",
            },
        ]);
        return res.json(__requestResponse("200", __SUCCESS, list));
    } catch (error) {
        console.log(error.message);
        return res.json(__requestResponse("500", __SOME_ERROR));
    }
});
router.post("/DeleteStation", async (req, res) => {
    try {
        const { StationId } = req.body;
        const station = await StationMaster.findByIdAndDelete(StationId);
        if (station) {
            return res.json(__requestResponse("200", __SUCCESS));
        }
        return res.json(__requestResponse("404", "Station Not found."));
    } catch (error) {
        console.log(error.message);
        return res.json(__requestResponse("500", __SOME_ERROR));
    }
});

module.exports = router;
