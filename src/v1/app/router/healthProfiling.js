const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const { __requestResponse } = require("../../../utils/constent");
const { __SUCCESS, __SOME_ERROR } = require("../../../utils/variable");
const HPQuestionMaster = require("../../../models/HPQuestionMaster");
const HPUserResponse = require("../../../models/HPUserResponse");
const { GetENV } = require("../constant");

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

module.exports = router;

// {
//     "AssetID": "",
//     "Questions": [
//         {
//             "Index": 0,
//             "Question_ID": "68d3cc3e734e0cf09c4b93f5",
//             "Answers": [
//                 "68d3cc3e734e0cf09c4b93f50Yes"
//             ],
//             "StringAnswers": [],
//             "HP_Category_ID": "68d3cb48734e0cf09c4b93e5"
//         },
//         {
//             "Index": 1,
//             "Question_ID": "68d3cc8a734e0cf09c4b93f8",
//             "Answers": [
//                 "68d3cc8a734e0cf09c4b93f80Yes"
//             ],
//             "StringAnswers": [],
//             "HP_Category_ID": "68d3cb48734e0cf09c4b93e5"
//         },
//         {
//             "Index": 2,
//             "Question_ID": "68d3ccd4734e0cf09c4b93fb",
//             "Answers": [
//                 "68d3ccd4734e0cf09c4b93fb1No"
//             ],
//             "StringAnswers": [],
//             "HP_Category_ID": "68d3cb48734e0cf09c4b93e5"
//         },
//         {
//             "Index": 3,
//             "Question_ID": "68d3cd01734e0cf09c4b93fe",
//             "Answers": [
//                 "68d3cd01734e0cf09c4b93fe1No"
//             ],
//             "StringAnswers": [],
//             "HP_Category_ID": "68d3cb48734e0cf09c4b93e5"
//         },
//         {
//             "Index": 4,
//             "Question_ID": "68d3cd4b734e0cf09c4b9401",
//             "Answers": [
//                 "68d3cd4b734e0cf09c4b94011Unilateral"
//             ],
//             "StringAnswers": [],
//             "HP_Category_ID": "68d3cb48734e0cf09c4b93e5"
//         },
//         {
//             "Index": 5,
//             "Question_ID": "68d3cda4734e0cf09c4b9404",
//             "Answers": [
//                 "68d3cda4734e0cf09c4b94040Yes"
//             ],
//             "StringAnswers": [],
//             "HP_Category_ID": "68d3cb48734e0cf09c4b93e5"
//         },
//         {
//             "Index": 6,
//             "Question_ID": "68d66729ae64027297f1e58f",
//             "Answers": [
//                 "68d66729ae64027297f1e58f2Moisture Content <3%",
//                 "68d66729ae64027297f1e58f1Dark or cloudy"
//             ],
//             "StringAnswers": [],
//             "HP_Category_ID": "68d664b9ae64027297f1e53f"
//         },
//         {
//             "Index": 7,
//             "Question_ID": "68d67401ae64027297f1e77c",
//             "Answers": [
//                 "68d67401ae64027297f1e77c3Tread depth adequate",
//                 "68d67401ae64027297f1e77c2Overinflated"
//             ],
//             "StringAnswers": [],
//             "HP_Category_ID": "68d664b9ae64027297f1e53f"
//         },
//         {
//             "Index": 8,
//             "Question_ID": "68d67477ae64027297f1e790",
//             "Answers": [
//                 "68d67477ae64027297f1e7903Brake lights not working"
//             ],
//             "StringAnswers": [],
//             "HP_Category_ID": "68d664b9ae64027297f1e53f"
//         },
//         {
//             "Index": 9,
//             "Question_ID": "68d67508ae64027297f1e7b9",
//             "Answers": [
//                 "68d67508ae64027297f1e7b93Uneven ride height"
//             ],
//             "StringAnswers": [],
//             "HP_Category_ID": "68d664b9ae64027297f1e53f"
//         }
//     ]
// }
