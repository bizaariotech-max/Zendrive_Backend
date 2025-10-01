const mongoose = require("mongoose");

const vehicleEventSchema = new mongoose.Schema(
    {
        ServiceTypeId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "admin_lookups", //service_type lookup
        },
        AssetId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "asset_master",
        },
        Date: String,
        Time: String,
        Comments: String,
        PickUpRequired: Boolean,
        HomeVisit: Boolean,
        AddressLine1: String,
        AddressLine2: String,
        CityId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "admin_lookups",
        },
        StateId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "admin_lookups",
        },
        PostalCode: String,
        Acknowledged: Boolean,
        Status: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "admin_lookups", // service_status lookup
        },
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("service_booking_register", vehicleEventSchema);
