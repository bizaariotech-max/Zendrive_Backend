const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const { __requestResponse, __deepClone } = require("../../../utils/constent");
const { __SUCCESS } = require("../../../utils/variable");
const StationMaster = require("../../../models/StationMaster");
const { GetENV } = require("../constant");
const ServiceBookingRegister = require("../../../models/ServiceBookingRegister");
const DutyAllocation = require("../../../models/DutyAllocation");

router.post("/AddServiceBookingReq", async (req, res) => {
    try {
        // env  - VEHICLE_INSPECTION , VEHICLE_SERVICE
        if (!req.body.ServiceType) {
            return res.json(
                __requestResponse("400", "Please Select Service Type")
            );
        }

        const ServiceType = await GetENV(req.body.ServiceType);
        const ServiceStatus = await GetENV("SERVICE_PENDING");
        const newData = {
            ServiceTypeId: ServiceType?.EnvSettingValue,
            AssetId: req.body?.AssetId || null,
            Date: req.body?.Date,
            Time: req.body?.Time,
            Comments: req.body?.Comments,
            PickUpRequired: req.body?.PickUpRequired || false,
            HomeVisit: req.body?.HomeVisit || false,
            AddressLine1: req.body?.AddressLine1,
            AddressLine2: req.body?.AddressLine2,
            StateId: req.body?.StateId,
            CityId: req.body?.CityId,
            PostalCode: req.body?.PostalCode,
            Acknowledged: req.body?.Acknowledged || false,
            Status: ServiceStatus?.EnvSettingValue,
        };
        await ServiceBookingRegister.create(newData);
        return res.json(__requestResponse("200", __SUCCESS));
    } catch (error) {
        console.log(error);
        return res.json(__requestResponse("500", error.message));
    }
});
router.post("/GetServiceBookingReq", async (req, res) => {
    try {
        // env  - VEHICLE_INSPECTION , VEHICLE_SERVICE , HEALTH_AUDIT
        if (!req.body.ServiceType) {
            return res.json(
                __requestResponse("400", "Please Select Service Type")
            );
        }

        const ServiceStatus = await GetENV(
            req.body.Status || "SERVICE_PENDING"
        );
        const ServiceType = await GetENV(req.body.ServiceType);
        const newData = {
            ServiceTypeId: ServiceType?.EnvSettingValue,
            Status: ServiceStatus?.EnvSettingValue,
        };
        const list = await ServiceBookingRegister.find(newData).populate([
            {
                path: "ServiceTypeId CityId StateId Status",
                select: "lookup_value",
            },
            {
                path: "AssetId",
                select: "StationId Vehicle.RegistrationNumber",
                populate: {
                    path: "StationId",
                    select: "StationName",
                },
            },
        ]);
        if (list.length == 0) {
            return res.json(__requestResponse("400", "List not found"));
        }

        const dutyAllocationList = await DutyAllocation.find({
            VehicleId: { $in: list.map((i) => i?.AssetId?._id) },
        }).populate(
            "DriverId",
            "Individual.FirstName Individual.LastName Individual.DLNumber"
        );

        return res.json(
            __requestResponse(
                "200",
                __SUCCESS,
                __deepClone(list).map((item) => {
                    const DriverDetails = __deepClone(dutyAllocationList).find(
                        (duty) =>
                            duty?.VehicleId?.toString() ===
                            item?.AssetId?._id?.toString()
                    )?.DriverId;
                    return {
                        ...item,
                        DriverDetails: {
                            _id: DriverDetails?._id,
                            ...DriverDetails?.Individual,
                        },
                    };
                })
            )
        );
    } catch (error) {
        console.log(error);
        return res.json(__requestResponse("500", error.message));
    }
});

router.post("/UpdateServiceStatus", async (req, res) => {
    try {
        // env  - SERVICE_PENDING
        if (!req.body.ServiceId) {
            return res.json(__requestResponse("400", "Service Id Not Found"));
        }
        if (!req.body.ServiceStatus) {
            return res.json(
                __requestResponse("400", "Please Select Service Status")
            );
        }

        const Service = await GetENV(req.body.ServiceStatus);
        const newData = {
            Status: Service?.EnvSettingValue,
        };
        await ServiceBookingRegister.findByIdAndUpdate(
            req.body.ServiceId,
            {
                $set: newData,
            },
            {
                new: true,
            }
        );
        return res.json(__requestResponse("200", __SUCCESS));
    } catch (error) {
        console.log(error);
        return res.json(__requestResponse("500", error.message));
    }
});
router.post("/UpdateService", async (req, res) => {
    try {
        if (!req.body.ServiceId) {
            return res.json(__requestResponse("400", "Service Id Not Found"));
        }

        const newData = {
            ...req.body,
        };
        await ServiceBookingRegister.findByIdAndUpdate(
            req.body.ServiceId,
            {
                $set: newData,
            },
            {
                new: true,
            }
        );
        return res.json(__requestResponse("200", __SUCCESS));
    } catch (error) {
        console.log(error);
        return res.json(__requestResponse("500", error.message));
    }
});

module.exports = router;
