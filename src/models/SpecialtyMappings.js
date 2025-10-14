const mongoose = require("mongoose");

const _SpecialityMapping = new mongoose.Schema({
    GroupCategory: { type: String },
    Icon: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "image_repositories",
    },
    SpecialtyId: [
        { type: mongoose.SchemaTypes.ObjectId, ref: "admin_lookups" },
    ],
    IsActive: { type: Boolean },
});

module.exports = mongoose.model("specialty_mapping", _SpecialityMapping);
