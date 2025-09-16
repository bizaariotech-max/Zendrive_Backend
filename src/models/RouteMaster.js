const mongoose = require("mongoose");

const vehicleEventSchema = new mongoose.Schema(
    {
        StationId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "station_master",
        },
        StartingStationId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "station_master",
        },
        TerminalStationId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "station_master",
        },
        EnrouteStation: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "station_master",
            },
        ],
        Schedules: [
            {
                Weekday: String,
                StartTime: String,
                EndTime: String,
            },
        ],
        DurationInHrsMins: String,
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("route_master", vehicleEventSchema);
