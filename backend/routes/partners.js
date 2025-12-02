const express = require("express");
const router = express.Router();
const PartnerRequest = require("../models/PartnerRequest");
const User = require("../models/User");
const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/authMiddleware");

// --------------------------------------------------
// POST /api/partners/request
// Send a partner request
// --------------------------------------------------
router.post("/request", authMiddleware, async (req, res) => {
  try {
    const { toUserId, bookingId } = req.body;

    if (!toUserId || !bookingId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Cannot send request to yourself
    if (toUserId === req.user.id) {
      return res.status(400).json({ message: "You cannot send a request to yourself" });
    }

    // Make sure recipient exists
    const userExists = await User.findById(toUserId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Booking must belong to the sender
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only partner request for your own booking" });
    }

    // Avoid duplicate requests
    const existing = await PartnerRequest.findOne({
      fromUser: req.user.id,
      toUser: toUserId,
      booking: bookingId,
      status: "pending"
    });

    if (existing) {
      return res.status(400).json({ message: "Request already sent" });
    }

    const request = new PartnerRequest({
      fromUser: req.user.id,
      toUser: toUserId,
      booking: bookingId
    });

    await request.save();
    res.status(201).json({ message: "Partner request sent", request });
  } catch (err) {
    console.error("Error sending request:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --------------------------------------------------
// GET /api/partners/incoming
// Requests sent *to me*
// --------------------------------------------------
router.get("/incoming", authMiddleware, async (req, res) => {
  try {
    const requests = await PartnerRequest.find({ toUser: req.user.id })
      .populate("fromUser", "username email")
      .populate("booking");

    res.json({ requests });
  } catch (err) {
    console.error("Error fetching incoming:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --------------------------------------------------
// GET /api/partners/outgoing
// Requests I sent
// --------------------------------------------------
router.get("/outgoing", authMiddleware, async (req, res) => {
  try {
    const requests = await PartnerRequest.find({ fromUser: req.user.id })
      .populate("toUser", "username email")
      .populate("booking");

    res.json({ requests });
  } catch (err) {
    console.error("Error fetching outgoing:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --------------------------------------------------
// PUT /api/partners/:id/respond
// Accept or reject
// --------------------------------------------------
router.put("/:id/respond", authMiddleware, async (req, res) => {
  try {
    const { action } = req.body;

    if (!["accepted", "rejected"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const request = await PartnerRequest.findById(req.params.id).populate("booking");
    if (!request) return res.status(404).json({ message: "Request not found" });

    // Only recipient can accept/reject
    if (request.toUser.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    request.status = action;
    await request.save();

    // If accepted, update the booking's partnerName with the accepting user's username
    if (action === "accepted") {
      const acceptingUser = await User.findById(req.user.id);
      const booking = await Booking.findById(request.booking._id);
      
      if (booking && acceptingUser) {
        booking.partnerName = acceptingUser.username;
        await booking.save();
      }
    }

    res.json({ message: `Request ${action}`, request });
  } catch (err) {
    console.error("Error responding:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;