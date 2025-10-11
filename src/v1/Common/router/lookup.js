const express = require("express");
const router = express.Router();

const { default: mongoose } = require("mongoose");

// constants & constant functions
const { __requestResponse, __deepClone } = require("../../../utils/constent");
const { __SUCCESS } = require("../../../utils/variable");

// models
const LookupMaster = require("../../../models/lookupmodel");
const StationMaster = require("../../../models/StationMaster");
const SymptomMapping = require("../../../models/SymptomMapping");

router.post("/LookupList", async (req, res) => {
    try {
        if (!req?.body?.lookup_type || req?.body?.lookup_type.length === 0) {
            return res.json(
                __requestResponse("400", "Lookup type is required")
            );
        }

        // For station lookup
        if (req?.body?.lookup_type[0] === "station") {
            const station = await StationMaster.find(
                { IsActive: true },
                "StationName"
            );
            if (station.length === 0) {
                return res.json(__requestResponse("404", "No Data found"));
            }
            return res.json(
                __requestResponse(
                    "200",
                    __SUCCESS,
                    station.map((item) => ({
                        lookup_value: item?.StationName,
                        _id: item._id,
                    }))
                )
            );
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
            .populate({
                path: "parent_lookup_id",
                select: "lookup_value parent_lookup_id",
                populate: { path: "parent_lookup_id", select: "lookup_value" },
            })
            .lean();

        if (list.length === 0) {
            return res.json(__requestResponse("404", "No Data found"));
        }
        console.log(list[0]);
        const transformedList = __deepClone(list).map((item) => ({
            ...item,
            parent_lookup_name: item?.parent_lookup_id?.lookup_value || "",
            parent_lookup_id: item?.parent_lookup_id?._id || "",
            ...(item?.other
                ? {
                      other: {
                          ...item?.other,

                          ...(item?.other?.investigation_typeId ==
                          item?.parent_lookup_id?.parent_lookup_id?._id
                              ? {
                                    investigation_typeId:
                                        item?.other?.investigation_typeId,
                                    investigation_type_name:
                                        item?.parent_lookup_id?.parent_lookup_id
                                            ?.lookup_value,
                                }
                              : null),
                      },
                  }
                : null),
        }));

        return res.json(__requestResponse("200", __SUCCESS, transformedList));
    } catch (error) {
        console.error(" LookupList Error:", error);
        return res.json(__requestResponse("500", error.message));
    }
});

router.post("/SymptomList", async (req, res) => {
    try {
        const { SymptomListFor = "" } = req.body;

        const list = await SymptomMapping.find({ SymptomListFor })
            .populate({
                path: "SymptomId",
                select: "lookup_value",
            })
            .sort({ SortOrder: 1 });

        if (!list || list.length == 0) {
            return res.json(__requestResponse("404", __NO_LOOKUP_LIST));
        }
        const newList = __deepClone(list).map((item) => ({
            id: item?.SymptomId._id,
            SymptomValue: item?.SymptomId.lookup_value,
            ConsiderDiseaseMapping: item?.ConsiderDiseaseMapping,
        }));

        return res.json(__requestResponse("200", __SUCCESS, newList));
    } catch (error) {
        return res.json(__requestResponse("500", __SOME_ERROR, error.message));
    }
});

module.exports = router;
