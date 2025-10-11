const mongoose = require("mongoose");
const _SymptomMap = new mongoose.Schema({
    SymptomListFor: { type: String },
    SymptomId: { type: mongoose.SchemaTypes.ObjectId, ref: "admin_lookups" },
    //To make sure only symptom need to be referred or its parent (disease) need to be considered
    ConsiderDiseaseMapping: { type: Boolean, default: false },
    SortOrder: {
        type: Number,
    },
});

module.exports = mongoose.model("symptom_mappings", _SymptomMap);

// specialty
// disease
// symptom
