const express = require("express");
const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// -----------------------------------------
// CREATE BOOKING
// POST /api/bookings
// -----------------------------------------
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { courtNumber, location, date, timeSlot, partnerName } = req.body;

    if (!courtNumber || !location || !date || !timeSlot) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await Booking.findOne({ date, courtNumber, timeSlot });
    if (existing) {
      return res.status(400).json({ message: "Court already booked for this time slot" });
    }

    const booking = new Booking({
      user: req.user.id,
      courtNumber,
      location,
      date,
      timeSlot,
      partnerName: partnerName || ""
    });

    await booking.save();
    res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -----------------------------------------
// GET ALL BOOKINGS FOR LOGGED-IN USER
// GET /api/bookings
// -----------------------------------------
router.get("/", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).sort({
      date: 1,
      timeSlot: 1
    });

    res.json({ bookings });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -----------------------------------------
// UPDATE BOOKING
// PUT /api/bookings/:id
// -----------------------------------------
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: "Not found" });

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updates = req.body;
    Object.assign(booking, updates);

    await booking.save();
    res.json({ message: "Booking updated", booking });
  } catch (err) {
    console.error("Error updating booking:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -----------------------------------------
// DELETE BOOKING
// DELETE /api/bookings/:id
// -----------------------------------------
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: "Not found" });

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await booking.deleteOne();
    res.json({ message: "Booking deleted" });
  } catch (err) {
    console.error("Error deleting booking:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
