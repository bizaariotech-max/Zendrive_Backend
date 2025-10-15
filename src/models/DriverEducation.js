const mongoose = require("mongoose");

const DriverEducationSchema = new mongoose.Schema(
    {
        Title: {
            type: String,
            required: true,
        },
        ShortDescription: {
            type: String,
            required: true,
        },
        LongDescription: {
            type: String,
            required: true,
        },
        VideoURL: {
            type: String,
            required: false,
        },
        ReferenceLinks: [
            {
                type: String,
                required: false,
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("driver_education", DriverEducationSchema);
