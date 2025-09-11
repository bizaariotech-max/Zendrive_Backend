const express = require("express");
const router = express.Router();

const { default: mongoose } = require("mongoose");

// constants & constant functions
const { __requestResponse } = require("../../../utils/constent");
const { __SUCCESS } = require("../../../utils/variable");

// models
const LookupMaster = require("../../../models/lookupmodel");

router.post("/LookupList", async (req, res) => {
    try {
        if (!req?.body?.lookup_type || req?.body?.lookup_type.length === 0) {
            return res.json(
                __requestResponse("400", "Lookup type is required")
            );
        }

        // For user_master_list lookup
        if (req?.body?.lookup_type[0] === "user_master_list") {
            // const users = await UserMaster.find();
            // if (users.length === 0) {
            //     return res.json(__requestResponse("404", "No Data found"));
            // }
            // return res.json(
            //     __requestResponse(
            //         "200",
            //         __SUCCESS,
            //         users.map((item) => ({
            //             // lookup_value: item?.FirstName + " " + item?.LastName,
            //             lookup_value: item?.FullName,
            //             _id: item._id,
            //         }))
            //     )
            // );
        }

        // For other lookup types
        const list = await LookupMaster.find({
            lookup_type: { $in: req?.body?.lookup_type || [] },
            ...(mongoose.Types.ObjectId.isValid(req.body?.parent_lookup_id) && {
                parent_lookup_id: mongoose.Types.ObjectId(
                    req.body?.parent_lookup_id
                ),
            }),
            is_active: true,
        })
            .populate("parent_lookup_id", "lookup_value")
            .lean();

        if (list.length === 0) {
            return res.json(__requestResponse("404", "No Data found"));
        }
        const transformedList = list.map((item) => ({
            ...item,
            parent_lookup_name: item?.parent_lookup_id?.lookup_value || "",
            parent_lookup_id: item?.parent_lookup_id?._id || "",
        }));

        return res.json(__requestResponse("200", __SUCCESS, transformedList));
    } catch (error) {
        console.error(" LookupList Error:", error);
        return res.json(__requestResponse("500", error.message));
    }
});

module.exports = router;
