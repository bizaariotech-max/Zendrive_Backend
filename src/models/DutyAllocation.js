const mongoose = require("mongoose");

const vehicleEventSchema = new mongoose.Schema(
    {
        RouteId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "route_master",
        },
        DateOfTrip: String,
        StartTimeOfTrip: String,
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
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("duty_allocation", vehicleEventSchema);
