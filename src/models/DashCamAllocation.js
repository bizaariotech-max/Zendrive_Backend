const mongoose = require("mongoose");

const vehicleEventSchema = new mongoose.Schema(
    {
        StationId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "station_master",
        },
        VehicleId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "asset_master",
        },
        SimCardNumber: String,
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("dash_cam_allocation", vehicleEventSchema);
