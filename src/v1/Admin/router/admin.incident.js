// const express = require("express");
// const router = express.Router();
// const { __requestResponse } = require("../../../utils/constent");
// const { __SUCCESS, __SOME_ERROR } = require("../../../utils/variable");
// const IncidentMaster = require("../../../models/IncidentMaster");

// // 📌 Add or Edit Incident
// router.post("/AddEditIncident", async (req, res) => {
//     try {
//         const { IncidentId } = req.body;

//         const newData = {
//             IncidentTypeId: req.body?.IncidentTypeId,
//             IncidentLocation: req.body?.IncidentLocation,
//             IncidentGeoLocation: req.body?.IncidentGeoLocation,
//             StationId: req.body?.StationId,
//             RouteId: req.body?.RouteId,
//             VehicleId: req.body?.VehicleId,
//             DriverId: req.body?.DriverId,
//             ConductorId: req.body?.ConductorId,
//             DateTimeOfIncident: req.body?.DateTimeOfIncident,
//             IncidentSeriousnessGrade: req.body?.IncidentSeriousnessGrade,
//             ViolationTypeId: req.body?.ViolationTypeId,
//             VideoEvidenceURL: req.body?.VideoEvidenceURL,
//             CauseofAccident: req.body?.CauseofAccident,
//             Responsibility: req.body?.Responsibility,
//             VehicleDamageReport: req.body?.VehicleDamageReport,
//             FactFindingReport: req.body?.FactFindingReport,
//             NoOfInjuries: req.body?.NoOfInjuries,
//             NoOfFatalities: req.body?.NoOfFatalities,
//             PictureGallery: req.body?.PictureGallery,
//             VideoGallery: req.body?.VideoGallery,
//             ChallanAct: req.body?.ChallanAct,
//             FineAmount: req.body?.FineAmount,
//             IsDLSuspended: req.body?.IsDLSuspended,
//             IsVehicleSeizedByPolice: req.body?.IsVehicleSeizedByPolice,
//         };

//         if (!IncidentId) {
//             await IncidentMaster.create(newData);
//             return res.json(__requestResponse("200", __SUCCESS));
//         }

//         await IncidentMaster.findByIdAndUpdate(
//             IncidentId,
//             { $set: newData },
//             { new: true }
//         );

//         return res.json(__requestResponse("200", __SUCCESS));
//     } catch (error) {
//         console.log(error);
//         return res.json(__requestResponse("500", error.message));
//     }
// });

// // 📌 Get All Incidents
// router.post("/GetIncident", async (req, res) => {
//     try {
//         const list = await IncidentMaster.find().populate([
//             {
//                 path: "IncidentTypeId ViolationTypeId CauseofAccident",
//                 select: "lookup_value",
//             },
//             { path: "StationId", select: "StationName" },
//             { path: "RouteId", select: "RouteName" },
//             { path: "VehicleId", select: "Vehicle.RegistrationNumber" },
//             {
//                 path: "DriverId ConductorId",
//                 select: "Individual.FirstName Individual.LastName",
//             },
//         ]);

//         return res.json(__requestResponse("200", __SUCCESS, list));
//     } catch (error) {
//         console.log(error.message);
//         return res.json(__requestResponse("500", __SOME_ERROR));
//     }
// });

// // 📌 Delete Incident
// router.post("/DeleteIncident", async (req, res) => {
//     try {
//         const { IncidentId } = req.body;
//         const incident = await IncidentMaster.findByIdAndDelete(IncidentId);
//         if (incident) {
//             return res.json(__requestResponse("200", __SUCCESS));
//         }
//         return res.json(__requestResponse("404", "Incident Not found."));
//     } catch (error) {
//         console.log(error.message);
//         return res.json(__requestResponse("500", __SOME_ERROR));
//     }
// });

// module.exports = router;
