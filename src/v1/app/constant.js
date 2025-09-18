const { default: mongoose } = require("mongoose");
const AdminEnvSetting = require("../../models/AdminEnvSetting");
const LookupMaster = require("../../models/lookupmodel");

const GetENV = async (code, type) => {
    if (type == "multi") {
        const __ENV = await AdminEnvSetting.find({
            EnvSettingCode: code,
        });

        return __ENV;
    }

    const __ENV = await AdminEnvSetting.findOne({
        EnvSettingCode: code,
    });

    return __ENV;
};
const GetLookup = async (lookup_type, parent_lookup_id) => {
    const list = await LookupMaster.find({
        lookup_type: { $in: lookup_type || [] },
        ...(mongoose.Types.ObjectId.isValid(parent_lookup_id) && {
            parent_lookup_id: mongoose.Types.ObjectId(parent_lookup_id),
        }),
        is_active: true,
    })
        .populate("parent_lookup_id", "lookup_value")
        .lean();
    const transformedList = list.map((item) => ({
        ...item,
        parent_lookup_name: item?.parent_lookup_id?.lookup_value || "",
        parent_lookup_id: item?.parent_lookup_id?._id || "",
    }));
    return transformedList;
};

module.exports = {
    GetENV,
    GetLookup,
};
