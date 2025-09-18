const express = require("express");
const router = express.Router();
const { __requestResponse } = require("../../../utils/constent");
const { __SUCCESS, __SOME_ERROR } = require("../../../utils/variable");
const LoginMaster = require("../../../models/LoginMaster");

// Add / Edit Login
router.post("/AddEditLogin", async (req, res) => {
    try {
        const { LoginId } = req.body;

        const newData = {
            RoleId: req.body?.RoleId,
            StationId: req.body?.StationId,
            AssetId: req.body?.AssetId,
            PhoneNumber: req.body?.PhoneNumber,
            IsActive: req.body?.IsActive,
            ...(req.body?.Password && {
                Password: req.body?.Password, // ⚠️ Ideally hash before save
            }),
        };

        if (!LoginId) {
            await LoginMaster.create(newData);
            return res.json(__requestResponse("200", __SUCCESS));
        }

        await LoginMaster.findByIdAndUpdate(
            LoginId,
            { $set: newData },
            { new: true }
        );
        return res.json(__requestResponse("200", __SUCCESS));
    } catch (error) {
        console.error(error);
        return res.json(__requestResponse("500", error.message));
    }
});

// Get Login List
router.post("/GetLogins", async (req, res) => {
    try {
        const list = await LoginMaster.find()
            .populate([
                { path: "RoleId", select: "lookup_value" },
                { path: "StationId", select: "StationName" },
                {
                    path: "AssetId",
                    select: "Individual.FirstName Individual.LastName Vehicle.RegistrationNumber",
                },
            ])
            .lean();

        return res.json(__requestResponse("200", __SUCCESS, list));
    } catch (error) {
        console.error(error.message);
        return res.json(__requestResponse("500", __SOME_ERROR));
    }
});
// Delete Login
router.post("/DeleteLogin", async (req, res) => {
    try {
        const { LoginId } = req.body;
        const login = await LoginMaster.findByIdAndDelete(LoginId);

        if (login) {
            return res.json(__requestResponse("200", __SUCCESS));
        }
        return res.json(__requestResponse("404", "Login not found."));
    } catch (error) {
        console.error(error.message);
        return res.json(__requestResponse("500", __SOME_ERROR));
    }
});

module.exports = router;
