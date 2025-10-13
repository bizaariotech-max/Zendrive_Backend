const mongoose = require("mongoose");
const _SymptomQuesOption = new mongoose.Schema({
  symptom_question_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "symptom_questions",
  },
  symptom_ques_option: { type: String },
  is_active: { type: Boolean },
});

module.exports = mongoose.model("symptom_ques_options", _SymptomQuesOption);
