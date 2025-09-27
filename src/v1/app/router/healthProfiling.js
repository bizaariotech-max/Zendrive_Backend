const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const { __requestResponse } = require("../../../utils/constent");
const { __SUCCESS, __SOME_ERROR } = require("../../../utils/variable");
const HPQuestionMaster = require("../../../models/HPQuestionMaster");
const HPUserResponse = require("../../../models/HPUserResponse");
const {
    GetENV,
    GroupQuestionsByLogicalGroup,
    GroupAnswersByCreatedAt,
} = require("../constant");

router.post("/GetHpQuestion", async (req, res) => {
    try {
        const assetType = req.body.AssetType;
        if (!assetType) {
            return res.json(
                __requestResponse("400", "Please Select Asset Type")
            );
        }

        // const AssetTypeIds = await GetENV(assetType)?.EnvSettingValue;
        const AssetTypeIds = await GetENV(assetType);
        console.log(AssetTypeIds);

        const list = await HPQuestionMaster.find({
            AssetType: AssetTypeIds?.EnvSettingValue,
        }).populate({
            path: "AssetType HPGroup InvestigationType QuestionType InputType LogicalGroup",
            select: "lookup_value",
        });
        return res.json(__requestResponse("200", __SUCCESS, list));
    } catch (error) {
        console.log(error.message);
        return res.json(__requestResponse("500", __SOME_ERROR));
    }
});
router.post("/SaveHpQuestionAnswer", async (req, res) => {
    try {
        console.log(JSON.stringify(req.body));

        const newList = req.body.Questions?.map((item) => ({
            AssetId: null,
            HPQuestion: item?.Question_ID,
            UserResponse: item?.Answers,
            DateAndTime: new Date(),
            GeoLocation: {
                type: "Point",
                coordinates: [0, 0],
            },
        }));
        await HPUserResponse.create(newList);

        return res.json(__requestResponse("200", __SUCCESS));
    } catch (error) {
        console.log(error.message);
        return res.json(__requestResponse("500", __SOME_ERROR));
    }
});

router.post("/GetHpQuestionAnswer", async (req, res) => {
    try {
        const assetType = req.body.AssetType;
        if (!assetType) {
            return res.json(
                __requestResponse("400", "Please Select Asset Type")
            );
        }

        // const AssetTypeIds = await GetENV(assetType)?.EnvSettingValue;
        const AssetTypeIds = await GetENV(assetType);
        console.log(AssetTypeIds);

        const list = await HPQuestionMaster.find(
            {
                AssetType: AssetTypeIds?.EnvSettingValue,
            },
            "LogicalGroup HPQuestion"
        ).populate({
            path: "LogicalGroup",
            select: "lookup_value",
        });
        const groupQuestion = await GroupQuestionsByLogicalGroup(list);

        const answers = await HPUserResponse.find(
            {
                HPQuestion: { $in: list.map((ids) => ids?._id) },
            },
            "-GeoLocation -AbnormalitiesFound -AssetId"
        ).populate([
            {
                path: "HPQuestion",
                select: "LogicalGroup HPQuestion",
                populate: {
                    path: "LogicalGroup",
                    select: "lookup_value",
                },
            },
        ]);
        const newAnswers = GroupAnswersByCreatedAt(answers);
        const keysArray = new Array();
        Object.entries(newAnswers).map(([group, questions]) =>
            keysArray.push(group)
        );

        return res.json(
            __requestResponse("200", __SUCCESS, {
                HeaderKeys: keysArray,
                Questions: groupQuestion,
                Answers: newAnswers,
            })
        );
    } catch (error) {
        console.log(error.message);
        return res.json(__requestResponse("500", __SOME_ERROR));
    }
});

module.exports = router;
