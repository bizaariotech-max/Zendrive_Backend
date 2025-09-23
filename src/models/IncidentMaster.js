const mongoose = require("mongoose");
const { Schema } = mongoose;

const _SchemaDesign = new Schema(
    {
        IncidentTypeId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "admin_lookups",
        },
        IncidentLocation: String,
        IncidentGeoLocation: {
            type: { type: String, enum: ["Point"], default: "Point" },
            coordinates: { type: [Number] }, // [lng, lat]
        },
        StationId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "station_master",
        },
        RouteId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "route_master",
        },
        VehicleId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "asset_master",
        },
        DriverId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "asset_master",
        },
        ConductorId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "asset_master",
        },
        DateTimeOfIncident: String,
        IncidentSeriousnessGrade: String,
        ViolationTypeId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "admin_lookups",
        },
        VideoEvidenceURL: String,
        CauseofAccident: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "admin_lookups",
        },
        Responsibility: String,
        VehicleDamageReport: String,
        FactFindingReport: String,
        NoOfInjuries: String,
        NoOfFatalities: String,
        PictureGallery: [String],
        VideoGallery: [String],
        ChallanAct: String,
        FineAmount: String,
        IsDLSuspended: Boolean,
        IsVehicleSeizedByPolice: Boolean,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("incident_master", _SchemaDesign);
