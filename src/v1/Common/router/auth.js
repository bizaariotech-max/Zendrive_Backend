const express = require("express");
const router = express.Router();
const {
    __requestResponse,
    __generateAuthToken,
} = require("../../../utils/constent");
const { __SUCCESS, __NOT_AUTHORIZE } = require("../../../utils/variable");
const LoginMaster = require("../../../models/LoginMaster");
const { GetENV } = require("../../app/constant");

router.post("/Login", async (req, res) => {
    try {
        const { PhoneNumber, Password, LoginFrom } = req.body;

        if (LoginFrom == "Admin") {
            const checklist = await GetENV("ADMIN_LOGIN", "multi");
            const user = await LoginMaster.findOne({
                RoleId: { $in: checklist.map((ids) => ids.EnvSettingValue) },
                PhoneNumber: PhoneNumber,
            }).populate("RoleId", "lookup_value");

            if (!user) {
                return res.json(__requestResponse("400", "Login Not Found"));
            }
            if (user.Password != Password) {
                return res.json(__requestResponse("401", "Invalid Password"));
            }
            const token = __generateAuthToken({
                _id: user._id,
                AdminData: user,
            });

            return res.json(
                __requestResponse("200", __SUCCESS, {
                    AuthToken: token,
                    UserDetails: {
                        PhoneNumber: user?.PhoneNumber,
                        Name: user?.RoleId?.lookup_value,
                        Role: user?.RoleId?.lookup_value,
                        RoleId: user?.RoleId?._id,
                    },
                })
            );
        } else if (["Driver", "HealthAccessor"].includes(LoginFrom)) {
            const checklist =
                LoginFrom == "Driver"
                    ? await GetENV("DRIVER_LOGIN", "multi")
                    : LoginFrom == "HealthAccessor"
                    ? await GetENV("HEALTH_ACCESSOR_LOGIN", "multi")
                    : [];

            if (checklist.length == 0) {
                return res.json(__requestResponse("400", "Role Not Found"));
            }

            const user = await LoginMaster.findOne({
                RoleId: { $in: checklist.map((ids) => ids.EnvSettingValue) },
                PhoneNumber: PhoneNumber,
            }).populate([
                { path: "RoleId", select: "lookup_value" },
                { path: "AssetId" },
                { path: "StationId", select: "StationName" },
            ]);

            if (!user) {
                return res.json(__requestResponse("400", "Login Not Found"));
            }
            if (user.Password != Password) {
                return res.json(__requestResponse("401", "Invalid Password"));
            }

            const AssetDetails = {
                AssetID: user?.AssetId?._id,
                StationId: user?.StationId,
                AssetTypeId: user?.AssetId?.AssetTypeId,
                FirstName: user?.AssetId?.Individual?.FirstName?.trim(),
                LastName: user?.AssetId?.Individual?.LastName?.trim(),
                DLNumber: user?.AssetId?.Individual?.DLNumber,
                EmailAddress: user?.AssetId?.Individual?.EmailAddress,
                LoginId: user?._id,
                CreatedAt: user?.AssetId?.createdAt,
            };
            const token = __generateAuthToken({
                _id: user?.AssetId?._id,
                AdminData: AssetDetails,
            });

            return res.json(
                __requestResponse("200", __SUCCESS, {
                    AuthToken: token,
                    LoginDetails: {
                        LoginId: user?._id,
                        PhoneNumber: user?.PhoneNumber,
                        Name: [
                            user?.AssetId?.Individual?.FirstName?.trim(),
                            user?.AssetId?.Individual?.LastName?.trim(),
                        ].join(" "),
                        Role: user?.RoleId?.lookup_value,
                        RoleId: user?.RoleId?._id,
                    },
                    AssetDetails: AssetDetails,
                })
            );
        } else {
            return res.json(__requestResponse("400", __NOT_AUTHORIZE));
        }
    } catch (error) {
        console.error(error);
        return res.json(__requestResponse("500", error.message));
    }
});

module.exports = router;
