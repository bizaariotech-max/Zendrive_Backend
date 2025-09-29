const mongoose = require("mongoose");

const vehicleEventSchema = new mongoose.Schema(
    {
        Geolocation: {
            type: { type: String, enum: ["Point"], default: "Point" },
            coordinates: { type: [Number], required: true }, // [longitude, latitude]
        },
        AccidentTypeIds: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "admin_lookups",
            },
        ],
        VehicleTypesInvolvedIds: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "admin_lookups",
            },
        ],
        ApproximateNoOfVictims: String,
        VisibleInjuryTypes: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "admin_lookups",
            },
        ],
        FatalityNo: String,

        VehicleInvolved: [
            {
                VehicleType: {
                    type: mongoose.SchemaTypes.ObjectId,
                    ref: "admin_lookups",
                },
                RegistrationNumber: String,
                PicturePfNumberPlate: String,
            },
        ],
        VictimNumber: String,
        VictimDetails: [
            {
                IdCardType: {
                    type: mongoose.SchemaTypes.ObjectId,
                    ref: "admin_lookups",
                },
                IdNumber: String,
                IdPicture: String,
            },
        ],
        AccidentSitesPicture: [String],
        AccidentVictimsPicture: [String],
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("report_road_accident", vehicleEventSchema);
