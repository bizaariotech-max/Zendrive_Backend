const express = require("express");
const { default: mongoose } = require("mongoose");
const moment = require("moment");
const router = express.Router();
const {
    __requestResponse,
    __getUserIdFromToken,
} = require("../../../utils/constent");

const { default: axios } = require("axios");
const ViolationEvent = require("../../../models/ViolationEvent");
const { __SUCCESS } = require("../../../utils/variable");
const IncidentMaster = require("../../../models/IncidentMaster");

router.post("/addViolationEvent", async (req, res) => {
    const {
        eventType,
        imeiNumber,
        deviceName,
        dateTimeStamp,
        videoUrl,
        latitude,
        longitude,
        address,
    } = req.body;

    try {
        let data = {
            eventType,
            imeiNumber,
            deviceName,
            dateTimeStamp,
            latitude,
            longitude,
            address,
            videoUrl,
        };

        const violationEvent = await ViolationEvent.create(data);

        await IncidentMaster.create({
            IncidentLocation: address,
            IncidentGeoLocation: {
                type: "Point",
                coordinates: [latitude, longitude],
            },
            VideoEvidenceURL: videoUrl,
            DateTimeOfIncident: dateTimeStamp,
        });
        if (violationEvent) {
            return res.json(
                __requestResponse(
                    "200",
                    "Violation Event has been saved successfully",
                    violationEvent
                )
            );
        } else {
            return res.json(
                __requestResponse(
                    "400",
                    "Error: Failed to save violation event"
                )
            );
        }
    } catch (error) {
        console.message(error);
        return res.json(
            __requestResponse(
                "400",
                "Error: Failed to save violation event",
                error.message
            )
        );
    }
});

router.post("/fetchViolationEvents", async (req, res) => {
    try {
        // const token = req.headers["auth-token"]?.split(" ")[1];
        const { filter, page = 1, limit = 20 } = req.body;
        console.log("body", req.body);

        const defaultFilter = {
            dayWise: "",
            fromDate: "",
            toDate: "",
            search: "",
            eventType: [], // Changed eventType to an array
        };

        const appliedFilter = { ...defaultFilter, ...filter };

        // console.log("filter:", appliedFilter);

        // const userId = __getUserIdFromToken(token);

        // const _assetID = await AssetMaster.findOne({ _id: userId });
        const _assetID = {
            FleetDriver: {
                RoadCastCredential: {
                    username: "8373915519",
                    password: "Abc@1234",
                    registry_number: "UP16BZ6080",
                },
            },
        };

        if (
            !_assetID?.FleetDriver?.RoadCastCredential?.username ||
            !_assetID?.FleetDriver?.RoadCastCredential?.password
        ) {
            return res.send(
                __requestResponse("400", "No RoadCast Credentials are present")
            );
        }

        const response = await axios.get(
            `https://pullapi-s1.track360.co.in/api/v1/auth/pull_api?username=${_assetID?.FleetDriver?.RoadCastCredential?.username}&password=${_assetID?.FleetDriver?.RoadCastCredential?.password}`
        );
        // console.log("first");
        // return res.json(__requestResponse("200", __SUCCESS, response.data));

        if (response.status === 200) {
            const newArray = response?.data?.data?.filter((item) => {
                return (
                    item.name ==
                    _assetID?.FleetDriver?.RoadCastCredential?.registry_number?.toUpperCase()
                );
            });

            // console.log("New Array:", newArray);

            const imeiNumber = newArray[0].deviceImei;

            const currentDate = moment.utc();
            let startDate, endDate;

            // Handle "dayWise" filter
            if (appliedFilter.dayWise) {
                if (appliedFilter.dayWise === "Today") {
                    startDate = currentDate.clone().startOf("day");
                    endDate = currentDate.clone().endOf("day");
                } else if (appliedFilter.dayWise === "This week") {
                    startDate = currentDate
                        .clone()
                        .subtract(6, "days")
                        .startOf("day");
                    endDate = currentDate.clone().endOf("day");
                } else if (appliedFilter.dayWise === "This month") {
                    startDate = currentDate
                        .clone()
                        .subtract(29, "days")
                        .startOf("day");
                    endDate = currentDate.clone().endOf("day");
                }
            }

            const matchFilter = {};

            // Apply "fromDate" and "toDate" filter
            if (appliedFilter.fromDate && appliedFilter.toDate) {
                const parsedFromDate = moment.utc(
                    appliedFilter.fromDate,
                    moment.ISO_8601
                );
                const parsedToDate = moment.utc(
                    appliedFilter.toDate,
                    moment.ISO_8601
                );

                if (parsedFromDate.isValid() && parsedToDate.isValid()) {
                    matchFilter.dateTimeStamp = {
                        $gte: parsedFromDate.startOf("day").toDate(),
                        $lte: parsedToDate.endOf("day").toDate(),
                    };
                }
            } else if (startDate && endDate) {
                matchFilter.dateTimeStamp = {
                    $gte: startDate.toDate(),
                    $lte: endDate.toDate(),
                };
            }

            if (appliedFilter.search) {
                matchFilter.address = {
                    $regex: appliedFilter.search,
                    $options: "i",
                };
            }

            if (appliedFilter.eventType && appliedFilter.eventType.length > 0) {
                // Fetch events matching any event type from the provided array
                matchFilter.eventType = { $in: appliedFilter.eventType }; // Change here to use `$in` for array matching

                const totalCount = await ViolationEvent.countDocuments({
                    imeiNumber,
                    ...matchFilter,
                });

                const eventData = await ViolationEvent.find({
                    imeiNumber,
                    ...matchFilter,
                })
                    .skip((page - 1) * limit) // Pagination logic: Skip records based on page number, with a fixed page size of 20
                    .limit(limit); // Always limit to 20 records per page

                const totalPages = Math.ceil(totalCount / 20); // Calculate total pages based on the fixed page size of 20
                const totalDocuments = await ViolationEvent.countDocuments({
                    imeiNumber,
                    ...matchFilter,
                });
                if (eventData.length > 0) {
                    return res.send(
                        __requestResponse(
                            "200",
                            "Events Fetched Successfully",
                            {
                                count: eventData.length,
                                totalPages, // Return the total number of pages
                                currentPage: page, // Return the current page number
                                data: eventData,
                                totalDocuments: totalDocuments,
                            }
                        )
                    );
                } else {
                    return res.send(
                        __requestResponse(
                            "200",
                            "No events found for the selected date range",
                            {
                                count: eventData.length,
                                totalPages,
                                currentPage: page,
                                data: [],
                                totalDocuments: totalDocuments,
                            }
                        )
                    );
                }
            } else {
                // Aggregate events by eventType
                const eventCounts = await ViolationEvent.aggregate([
                    { $match: { imeiNumber, ...matchFilter } },
                    { $group: { _id: "$eventType", count: { $sum: 1 } } },
                ]);

                const latestEvents = await ViolationEvent.find({
                    imeiNumber,
                    videoUrl: {
                        $exists: true,
                        $type: "array",
                        $ne: [],
                        $not: { $size: 0 },
                    }, // Ensure non-empty array
                })
                    .sort({ dateTimeStamp: -1 }) // Sort by latest timestamp
                    .limit(4) // Get only 4 latest events
                    .lean();

                const allVideoUrls = latestEvents.flatMap(
                    (event) => event.videoUrl
                );

                if (eventCounts.length === 0) {
                    return res.send(
                        __requestResponse(
                            "200",
                            "No events found for the selected date range",
                            {
                                data: {
                                    latestEventWithVideos: allVideoUrls,
                                },
                            }
                        )
                    );
                }

                const eventArray = eventCounts.map((ele) => [
                    ele._id,
                    ele.count,
                ]);

                // Sending response with event counts and the latest event with videos

                return res.send(
                    __requestResponse("200", "Events fetched successfully", {
                        data: {
                            eventArray,
                            latestEventWithVideos: allVideoUrls,
                        },
                    })
                );

                // return res.send(
                //   __requestResponse("200", "Event Type Counts Fetched Successfully", {
                //     data: eventArray,
                //   })
                // );
            }
        } else {
            return res.send(__requestResponse("400", "Something Went Wrong"));
        }
    } catch (error) {
        console.log(error);
        return res.send(
            __requestResponse("500", "Something Went Wrong", error.message)
        );
    }
});

module.exports = router;
