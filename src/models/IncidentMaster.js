const mongoose = require("mongoose");
const { Schema } = mongoose;

const _SchemaDesign = new Schema(
    {
        IncidentTypeId: {
            type: mongoose.SchemaTypes.ObjectId,
            // ref:""
        },
        IncidentLocation: String,
        IncidentGeoLocation: {
            type: { type: String, enum: ["Point"], default: "Point" },
            coordinates: { type: [Number] }, // [lng, lat]
        },
        StationId: {
            type: mongoose.SchemaTypes.ObjectId,
            // ref:""
        },
        RouteId: {
            type: mongoose.SchemaTypes.ObjectId,
            // ref:""
        },
        VehicleId: {
            type: mongoose.SchemaTypes.ObjectId,
            // ref:""
        },
        DriverId: {
            type: mongoose.SchemaTypes.ObjectId,
            // ref:""
        },
        ConductorId: {
            type: mongoose.SchemaTypes.ObjectId,
            // ref:""
        },
        DateTimeOfIncident: String,
        IncidentSeriousnessGrade: String,
        ViolationTypeId: {
            type: mongoose.SchemaTypes.ObjectId,
            // ref:""
        },
        VideoEvidenceURL: String,
        CauseofAccident: {
            type: mongoose.SchemaTypes.ObjectId,
            // ref:""
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
