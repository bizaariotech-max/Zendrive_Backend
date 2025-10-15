const express = require("express");
const router = express.Router();
const { __requestResponse } = require("../../../utils/constent");
const { __SUCCESS, __SOME_ERROR } = require("../../../utils/variable");
const DriverEducation = require("../../../models/DriverEducation");

// 📋 List Driver Education (All)
router.get("/ListDriverEducation", async (req, res) => {
    try {
        const data = await DriverEducation.find()
            // .sort({ createdAt: -1 }) // latest first
            .lean();

        return res.json(__requestResponse("200", __SUCCESS, data));
    } catch (error) {
        console.error("ListDriverEducation Error:", error);
        return res.json(
            __requestResponse("500", error.message || __SOME_ERROR)
        );
    }
});

module.exports = router;
