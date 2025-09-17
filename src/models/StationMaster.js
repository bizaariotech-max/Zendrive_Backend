const mongoose = require("mongoose");

const vehicleEventSchema = new mongoose.Schema(
    {
        StationTypeId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "admin_lookups",
        },
        ParentStationId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "station_master",
        },
        StationName: String,
        AddressLine1: String,
        AddressLine2: String,
        PostalCode: String,
        StateId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "admin_lookups",
        },
        CityId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "admin_lookups",
        },
        Geolocation: {
            type: { type: String, enum: ["Point"], default: "Point" },
            coordinates: { type: [Number], required: true }, // [longitude, latitude]
        },
        IsActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("station_master", vehicleEventSchema);
