const express = require("express");
const router = express.Router();
const { default: mongoose } = require("mongoose");

const {
    __SUCCESS,
    __SOME_ERROR,
    __DATA_404,
} = require("../../../utils/variable");
const { __requestResponse, __deepClone } = require("../../../utils/constent");
const { __fetchToken } = require("../middleware/authentication");

const SymptomQuestions = require("../../../models/SymptomQuestions");
const Symptom_Question_Options = require("../../../models/Symptom_Question_Options");
const SymptomMapping = require("../../../models/SymptomMapping");
const LookupModel = require("../../../models/lookupmodel");

// router.post("/GeneralQuestion", __fetchToken, async (req, res) => {
router.post("/GeneralQuestion", async (req, res) => {
    try {
        const { Symptoms = [] } = req.body;

        console.log(Symptoms);
        if (!Symptoms || Symptoms.length == 0) {
            return res.json(
                __requestResponse("400", "Please select symptom(s)")
            );
        }

        const AllSymptoms = await SymptomMapping.find({
            SymptomId: { $in: Symptoms },
        }).populate({
            path: "SymptomId",
            select: "lookup_value",
        });

        if (!AllSymptoms || AllSymptoms.length == 0) {
            return res.json(__requestResponse("404", __DATA_404));
        }
        const newSymptomsList = __deepClone(AllSymptoms).map((item) => ({
            id: item?.SymptomId._id,
            SymptomValue: item?.SymptomId.lookup_value,
            ConsiderDiseaseMapping: item?.ConsiderDiseaseMapping,
        }));

        const associatedSymptom = await LookupModel.find(
            {
                lookup_type: "associated_symptom",
                parent_lookup_id: {
                    $in: Symptoms.filter((_ids) =>
                        mongoose.Types.ObjectId.isValid(_ids)
                    ),
                },
            },
            "lookup_value parent_lookup_id"
        );

        const _AllQuestions = await SymptomQuestions.find({
            symptom_id: { $in: Symptoms },
        }).populate({
            path: "symptom_id",
            select: "lookup_value",
        });

        const questionIDs = new Array();

        __deepClone(_AllQuestions).map((item) => questionIDs.push(item.id));

        const _AllOptions = await Symptom_Question_Options.find({
            $in: questionIDs,
            is_active: true,
        });
        const cloneAllOptions = __deepClone(_AllOptions);

        const allQuestionWithOptionsMap = __deepClone(_AllQuestions).map(
            (item) => ({
                ...item,
                Options: cloneAllOptions.filter(
                    (option) => option.symptom_question_id == item._id
                ),
            })
        );

        return res.json(
            __requestResponse(
                "200",
                __SUCCESS,
                newSymptomsList.map((item) => {
                    const questions =
                        allQuestionWithOptionsMap?.filter(
                            (que) => que.symptom_id?._id == item?.id
                        ) || [];
                    return {
                        ...item,
                        Questions: questions,
                        AssociatedSymptoms: __deepClone(associatedSymptom)
                            .filter((a_s) => a_s.parent_lookup_id == item.id)
                            .map((a_s) => ({
                                id: a_s._id,
                                name: a_s.lookup_value,
                            })),
                    };
                })
            )
        );
    } catch (error) {
        console.log(error);
        return res.json(__requestResponse("500", __SOME_ERROR, error));
    }
});

module.exports = router;
