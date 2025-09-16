const mongoose = require("mongoose");

const vehicleEventSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
    },
    imeiNumber: {
      type: String, // Device Imei Number
    },
    deviceName: {
      type: String, // Vehicle number
    },
    latitude: {
      type: String,
    },
    longitude: {
      type: String,
    },
    address: {
      type: String, // Address Where the violation has been done
    },
    dateTimeStamp: {
      type: Date,
    },
    videoUrl: {
      type: [String], // Array of strings for video URLs
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("vehicle_event", vehicleEventSchema);
