const express = require("express");
const router = express.Router();
const { __requestResponse } = require("../../../utils/constent");
const { __SUCCESS, __SOME_ERROR } = require("../../../utils/variable");
const DashCamAllocation = require("../../../models/DashCamAllocation");

router.post("/AddEditDashCam", async (req, res) => {
    try {
        const { DashCamId } = req.body;

        const newData = {
            StationId: req.body?.StationId,
            VehicleId: req.body?.VehicleId,
            SimCardNumber: req.body?.SimCardNumber,
        };
        if (!DashCamId) {
            await DashCamAllocation.create(newData);
            return res.json(__requestResponse("200", __SUCCESS));
        }
        await DashCamAllocation.findByIdAndUpdate(
            DashCamId,
            { $set: newData },
            { new: true }
        );

        return res.json(__requestResponse("200", __SUCCESS));
    } catch (error) {
        console.log(error);
        return res.json(__requestResponse("500", error.message));
    }
});
router.post("/GetDashCam", async (req, res) => {
    try {
        const list = await DashCamAllocation.find().populate([
            {
                path: "StationId",
                select: "StationName",
            },
            {
                path: "VehicleId",
                select: "Vehicle.RegistrationNumber",
            },
        ]);
        return res.json(__requestResponse("200", __SUCCESS, list));
    } catch (error) {
        console.log(error.message);
        return res.json(__requestResponse("500", __SOME_ERROR));
    }
});
router.post("/DeleteDashCam", async (req, res) => {
    try {
        const { DashCamId } = req.body;
        const list = await DashCamAllocation.findByIdAndDelete(DashCamId);
        if (list) {
            return res.json(__requestResponse("200", __SUCCESS));
        }
        return res.json(
            __requestResponse("404", "Dash Cam Allocation Not found.")
        );
    } catch (error) {
        console.log(error.message);
        return res.json(__requestResponse("500", __SOME_ERROR));
    }
});

module.exports = router;
