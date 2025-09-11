const AdminEnvSetting = require("../../models/AdminEnvSetting");

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

module.exports = {
    GetENV,
};
