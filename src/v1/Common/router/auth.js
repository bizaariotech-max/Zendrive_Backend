const express = require("express");
const router = express.Router();
const {
    __requestResponse,
    __generateAuthToken,
} = require("../../../utils/constent");
const {
    __SUCCESS,
    __SOME_ERROR,
    __NOT_AUTHORIZE,
} = require("../../../utils/variable");
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
        } else {
            return res.json(__requestResponse("400", __NOT_AUTHORIZE));
        }
    } catch (error) {
        console.error(error);
        return res.json(__requestResponse("500", error.message));
    }
});

module.exports = router;
