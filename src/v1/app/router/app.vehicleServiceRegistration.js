const express = require("express");
const router = express.Router();
const { __requestResponse } = require("../../../utils/constent");
const { __SUCCESS, __SOME_ERROR } = require("../../../utils/variable");
const VehicleServiceRegistration = require("../../../models/VehicleServiceRegistration");

router.post("/AddVehicleService", async (req, res) => {
    try {
        const newData = {
            VehicleId: req.body?.VehicleId,
            DriverId: req.body?.DriverId,
            ServiceCentreName: req.body?.ServiceCentreName || "",
            ServiceDate: req.body?.ServiceDate || null,
            KmCovered: req.body?.KmCovered || "",
            NextServiceKm: req.body?.NextServiceKm || "",
            NextServiceDate: req.body?.NextServiceDate || null,
            BatteryChangeKm: req.body?.BatteryChangeKm || "",
            BatteryChangeDate: req.body?.BatteryChangeDate || null,
            TyreChangeKm: req.body?.TyreChangeKm || "",
            TyreChangeDate: req.body?.TyreChangeDate || null,

            // Service Chart
            IsOilAndFilterChanged: req.body?.IsOilAndFilterChanged || false,
            IsTyreRotation: req.body?.IsTyreRotation || false,
            IsFuelFilter: req.body?.IsFuelFilter || false,
            IsEngineAirFilter: req.body?.IsEngineAirFilter || false,
            IsEngineCoolant: req.body?.IsEngineCoolant || false,
            IsBrakeFluid: req.body?.IsBrakeFluid || false,
            IsCabinAirFilters: req.body?.IsCabinAirFilters || false,
            IsSparkPlugs: req.body?.IsSparkPlugs || false,

            // Vehicle inspection report
            HornsLightsStatus: req.body?.HornsLightsStatus || null,
            BrakeStatus: req.body?.BrakeStatus || null,
            ClutchStatus: req.body?.ClutchStatus || null,
            SteeringStatus: req.body?.SteeringStatus || null,
            TyrePressureStatus: req.body?.TyrePressureStatus || null,
            WheelAlignmentStatus: req.body?.WheelAlignmentStatus || null,
            TyreAgeStatus: req.body?.TyreAgeStatus || null,
            TransmissionStatus: req.body?.TransmissionStatus || null,
            CoolantStatus: req.body?.CoolantStatus || null,
            SuspensionStatus: req.body?.SuspensionStatus || null,
            BatteryAgeStatus: req.body?.BatteryAgeStatus || null,
        };

        await VehicleServiceRegistration.create(newData);

        return res.json(__requestResponse("200", __SUCCESS));
    } catch (error) {
        console.error("AddEditVehicleEvent Error:", error);
        return res.json(
            __requestResponse("500", error.message || __SOME_ERROR)
        );
    }
});

module.exports = router;
