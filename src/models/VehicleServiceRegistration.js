const mongoose = require("mongoose");

const vehicleEventSchema = new mongoose.Schema(
    {
        VehicleId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "asset_master",
        },
        DriverId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "asset_master",
        },
        ServiceCentreName: {
            type: String,
            default: "",
        },
        ServiceDate: {
            type: Date,
            default: null,
        },
        KmCovered: {
            type: String,
            default: "",
        },
        NextServiceKm: {
            type: String,
            default: "",
        },
        NextServiceDate: {
            type: Date,
            default: null,
        },
        BatteryChangeKm: {
            type: String,
            default: "",
        },
        BatteryChangeDate: {
            type: Date,
            default: null,
        },
        TyreChangeKm: {
            type: String,
            default: "",
        },
        TyreChangeDate: {
            type: Date,
            default: null,
        },
        // Service Chart
        IsOilAndFilterChanged: {
            type: Boolean,
            default: false,
        },
        IsTyreRotation: {
            type: Boolean,
            default: false,
        },
        IsFuelFilter: {
            type: Boolean,
            default: false,
        },
        IsEngineAirFilter: {
            type: Boolean,
            default: false,
        },
        IsEngineCoolant: {
            type: Boolean,
            default: false,
        },
        IsBrakeFluid: {
            type: Boolean,
            default: false,
        },
        IsCabinAirFilters: {
            type: Boolean,
            default: false,
        },
        IsSparkPlugs: {
            type: Boolean,
            default: false,
        },
        // Vehicle inspection report
        HornsLightsStatus: {
            type: String,
            default: null,
        },
        BrakeStatus: {
            type: String,
            default: null,
        },
        ClutchStatus: {
            type: String,
            default: null,
        },
        SteeringStatus: {
            type: String,
            default: null,
        },
        TyrePressureStatus: {
            type: String,
            default: null,
        },
        WheelAlignmentStatus: {
            type: String,
            default: null,
        },
        TyreAgeStatus: {
            type: String,
            default: null,
        },
        TransmissionStatus: {
            type: String,
            default: null,
        },
        CoolantStatus: {
            type: String,
            default: null,
        },
        SuspensionStatus: {
            type: String,
            default: null,
        },
        BatteryAgeStatus: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model(
    "vehicle_service_registration",
    vehicleEventSchema
);
