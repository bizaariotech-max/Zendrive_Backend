const mongoose = require("mongoose");

const vehicleEventSchema = new mongoose.Schema(
    {
        StationId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "route_master",
        },
        VehicleId: {
            type: mongoose.SchemaTypes.ObjectId,
            // ref: "station_master",
        },
        SimCardNumber: String,
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("route_master", vehicleEventSchema);
