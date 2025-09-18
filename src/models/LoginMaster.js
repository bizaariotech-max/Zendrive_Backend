const mongoose = require("mongoose");

// ASSET MASTER SCHEMA
const _SchemaDesign = new mongoose.Schema(
    {
        RoleId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "admin_lookups",
            required: true,
        },
        StationId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "station_master",
            required: true,
        },
        AssetId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "asset_master",
            required: true,
        },
        PhoneNumber: {
            type: String,
            required: true,
            unique: true,
        },
        Password: {
            type: String,
            required: true,
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

// Optional: Index for quick login queries
_SchemaDesign.index({ PhoneNumber: 1 });

module.exports = mongoose.model("login_master", _SchemaDesign);
