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
            HPGroup: req.body?.HPQuestionCategory,
            QuestionOrder: req.body?.HPQuestionCategory,
            LogicalGroup: req.body?.HPQuestionCategory,
            InvestigationType: req.body?.HPQuestionCategory,
            QuestionType: req.body?.HPQuestionCategory,
            HPQuestion: req.body?.HPQuestionCategory,
            OptionValues: req.body?.HPQuestionCategory,
            SelectionType: req.body?.HPQuestionCategory,
            InputType: req.body?.HPQuestionCategory,
            ValidityMinValue: req.body?.HPQuestionCategory,
            ValidityMaxValue: req.body?.HPQuestionCategory,
            ResponseUnit: req.body?.HPQuestionCategory,
            NormalValueMinimum: req.body?.HPQuestionCategory,
            NormalValueMaximum: req.body?.HPQuestionCategory,
            WeightageValueMinimum: req.body?.HPQuestionCategory,
            WeightageValueMaximum: req.body?.HPQuestionCategory,
            SOSValueMinimum: req.body?.HPQuestionCategory,
            SOSValueMaximum: req.body?.HPQuestionCategory,
            IsActive: req.body?.HPQuestionCategory,
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
