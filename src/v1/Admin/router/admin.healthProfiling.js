const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const { __requestResponse } = require("../../../utils/constent");
const { __SUCCESS, __SOME_ERROR } = require("../../../utils/variable");
const HPQuestionMaster = require("../../../models/HPQuestionMaster");

router.post("/AddEditHpQuestion", async (req, res) => {
    try {
        const { HPQuestionId } = req.body;

        const newData = {
            HPQuestionCategory: req.body?.HPQuestionCategory,
            HPGroup: req.body?.HPGroup,
            QuestionOrder: req.body?.QuestionOrder,
            LogicalGroup: req.body?.LogicalGroup,
            InvestigationType: req.body?.InvestigationType,
            QuestionType: req.body?.QuestionType,
            HPQuestion: req.body?.HPQuestion,
            OptionValues: req.body?.OptionValues,
            SelectionType: req.body?.SelectionType,
            InputType: req.body?.InputType,
            ValidityMinValue: req.body?.ValidityMinValue,
            ValidityMaxValue: req.body?.ValidityMaxValue,
            ResponseUnit: req.body?.ResponseUnit,
            NormalValueMinimum: req.body?.NormalValueMinimum,
            NormalValueMaximum: req.body?.NormalValueMaximum,
            WeightageValueMinimum: req.body?.WeightageValueMinimum,
            WeightageValueMaximum: req.body?.WeightageValueMaximum,
            SOSValueMinimum: req.body?.SOSValueMinimum,
            SOSValueMaximum: req.body?.SOSValueMaximum,
            IsActive: req.body?.IsActive,
        };
        if (!HPQuestionId) {
            await HPQuestionMaster.create(newData);
            return res.json(__requestResponse("200", __SUCCESS));
        }
        await HPQuestionMaster.findByIdAndUpdate(
            HPQuestionId,
            { $set: newData },
            { new: true }
        );

        return res.json(__requestResponse("200", __SUCCESS));
    } catch (error) {
        console.log(error.message);
        return res.json(__requestResponse("500", __SOME_ERROR));
    }
});
router.post("/GetHpQuestion", async (req, res) => {
    try {
        const list = await HPQuestionMaster.find();
        return res.json(__requestResponse("200", __SUCCESS, list));
    } catch (error) {
        console.log(error.message);
        return res.json(__requestResponse("500", __SOME_ERROR));
    }
});

module.exports = router;
