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
    GroupQuestionsByHpGroup,
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

router.post("/GetHealthProfileQuestion", async (req, res) => {
    try {
        const HPGroup = req.body.HpGroupId;
        if (!HPGroup) {
            return res.json(
                __requestResponse("400", "Please Select Asset Type")
            );
        }

        const list = await HPQuestionMaster.find({
            HPGroup: HPGroup,
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
router.post("/GetHealthProfileQuestionAnswer", async (req, res) => {
    try {
        const list = await HPQuestionMaster.find(
            {
                HPGroup: {
                    $in: [
                        "68c3c8aeec258ce81beb8192",
                        "68c3c8baec258ce81beb819d",
                        "68e78961771e398415e36191",
                        "68e78978771e398415e3619d",
                        "68d1011468c338f792f3d8b3",
                        "68d100f468c338f792f3d88f",
                        "68e7899b771e398415e361a9",
                        "68e7899b771e398415e361a9",
                        "68e789c8771e398415e361b6",
                        "68e789d8771e398415e361c2",
                        "68e789e8771e398415e361ce",
                        "68e789f7771e398415e361da",
                    ],
                },
            },
            "HPGroup HPQuestion"
        ).populate({
            path: "HPGroup",
            select: "lookup_value",
        });
        const groupQuestion = await GroupQuestionsByHpGroup(list);

        const answers = await HPUserResponse.find(
            {
                HPQuestion: { $in: list.map((ids) => ids?._id) },
            },
            "-GeoLocation -AbnormalitiesFound -AssetId"
        ).populate([
            {
                path: "HPQuestion",
                // select: "HPGroup HPQuestion",
                populate: {
                    path: "AssetType HPGroup InvestigationType QuestionType InputType",
                    select: "lookup_value",
                },
            },
        ]);

        return res.json(
            __requestResponse("200", __SUCCESS, {
                Questions: groupQuestion,
                Answers: answers,
            })
        );
    } catch (error) {
        console.log(error.message);
        return res.json(__requestResponse("500", __SOME_ERROR));
    }
});

router.post("/UpdateHpQuestionAnswer", async (req, res) => {
    try {
        console.log(JSON.stringify(req.body));

        // const newList = req.body.Questions?.map((item) => ({
        //     AssetId: null,
        //     HPQuestion: item?.Question_ID,
        //     UserResponse: item?.Answers,
        //     DateAndTime: new Date(),
        //     GeoLocation: {
        //         type: "Point",
        //         coordinates: [0, 0],
        //     },
        // }));
        // await HPUserResponse.create(newList);

        if (req.body.Questions && req.body.Questions.length != 0) {
            for (let index = 0; index < req.body.Questions.length; index++) {
                const element = req.body.Questions[index];
                await HPUserResponse.findByIdAndUpdate(
                    element?.AnswerId,
                    {
                        $set: {
                            UserResponse: element?.Answers,
                        },
                    },
                    { new: true }
                );
            }

            return res.json(__requestResponse("400", __SUCCESS));
        }

        return res.json(__requestResponse("400", "Bad Request"));
    } catch (error) {
        console.log(error.message);
        return res.json(__requestResponse("500", __SOME_ERROR));
    }
});

module.exports = router;
