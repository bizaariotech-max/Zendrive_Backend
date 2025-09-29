const mongoose = require("mongoose");

const vehicleEventSchema = new mongoose.Schema(
    {
        AssetId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "asset_master",
        },
        StationId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "station_master",
        },
        ReportingAssetId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "asset_master",
        },
        RouteId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "route_master",
        },
        ConductorAssetId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "asset_master",
        },
        SOSId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "admin_lookups",
        },
        Address: String,
        Geolocation: {
            type: { type: String, enum: ["Point"], default: "Point" },
            coordinates: { type: [Number], required: true }, // [longitude, latitude]
        },
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("sos", vehicleEventSchema);
