const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    courtNumber: {
      type: Number,
      required: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: String, // ISO date string from frontend (YYYY-MM-DD)
      required: true
    },
    timeSlot: {
      type: String, // "7-8 PM"
      required: true
    },
    partnerName: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      default: "booked",
      enum: ["booked", "cancelled"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
