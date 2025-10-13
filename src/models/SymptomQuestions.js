const mongoose = require("mongoose");
const _SymptomQuestions = new mongoose.Schema(
    {
        symptom_id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "admin_lookups",
        },
        consultation_type_id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "admin_lookups",
        },
        symptom_question: { type: String },
        is_active: { type: Boolean },

        //SCALE, STRING, NUMBER, DATE, SINGLE SELECTION, MULTI SELECTION
        question_type: { type: String },
        minRange: { type: Number },
        maxRange: { type: Number },
        rangeStep: { type: Number },
        isOneLine: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("symptom_questions", _SymptomQuestions);
