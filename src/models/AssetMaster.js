const mongoose = require("mongoose");

// ASSET MASTER SCHEMA
const _SchemaDesign = new mongoose.Schema(
    {
        AssetTypeId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "admin_lookups",
        },
        StationId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "station_master",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("asset_master", _SchemaDesign);
