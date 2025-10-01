const mongoose = require("mongoose");

// ASSET MASTER SCHEMA
const _SchemaDesign = new mongoose.Schema(
    {
        AssetTypeId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "admin_lookups", // Values: Management, Driver, Conductor, Vehicle
        },
        StationId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "station_master",
        },

        // -------------------
        // Section 1: Individual
        // -------------------
        Individual: {
            ReportingTo: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "asset_master", // Self-reference (Asset ID)
            },
            FirstName: String,
            LastName: String,
            DateOfBirth: Date,
            DateOfJoining: Date,
            Gender: { type: String, enum: ["Male", "Female", "Other"] },
            DLNumber: String,
            IssuingAuthority: String, // RTO Name
            DLValidUpTo: Date,
            DLUploadedCopy: String, // File URL / path
            DepartmentId: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "admin_lookups",
            },
            DesignationId: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "admin_lookups",
            },
            BloodGroup: String,
            PhoneNumber: { type: String },
            EmailAddress: { type: String },
            EmergencyContact1: String,
            EmergencyContact2: String,
        },

        // -------------------
        // Section 2: Vehicle
        // -------------------
        Vehicle: {
            RegistrationNumber: String,
            RegistrationAuthority: String, // RTO Office Name
            VehicalType: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "admin_lookups", //vehical_type lookup
            },
            MakeId: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "admin_lookups",
            },
            VehicleModelId: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "admin_lookups",
            },
            ManufacturingYear: Number,
            FuelTypeId: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "admin_lookups", // Values: Petrol, Diesel, Electric
            },
            ColorId: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "admin_lookups",
            },
            RegistrationValidUpTo: Date,
            PUCValidUpTo: Date,
            PermitValidUpTo: Date,
            FitnessValidUpTo: Date,
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

module.exports = mongoose.model("asset_master", _SchemaDesign);
