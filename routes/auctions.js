const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Auction = require("../models/Auction");

// Create Auction
router.post("/", auth, async (req, res) => {
  const { title, description, startingBid } = req.body;

  try {
    const newAuction = new Auction({
      title,
      description,
      startingBid,
      currentBid: startingBid,
      createdBy: req.user.id,
    });

    const auction = await newAuction.save();
    res.json(auction);
  } catch (e) {
    res.status(500).send("Server error");
  }
});

// Read All Auctions
router.get("/", async (req, res) => {
  try {
    const auctions = await Auction.find().populate("createdBy", ["username"]);
    res.json(auctions);
  } catch (e) {
    res.status(500).send("Server error");
  }
});

// Read Single Auction
router.get("/:id", async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id).populate(
      "createdBy",
      ["username"]
    );
    if (!auction) return res.status(404).json({ msg: "Auction not found" });
    res.json(auction);
  } catch (e) {
    res.status(500).send("Server error");
  }
});

// Update Auction
router.put("/:id", auth, async (req, res) => {
  const { title, description, startingBid, currentBid } = req.body;

  try {
    let auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ msg: "Auction not found" });

    // Check if the user owns the auction
    if (auction.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    auction = await Auction.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description, startingBid, currentBid } },
      { new: true }
    );

    res.json(auction);
  } catch (e) {
    res.status(500).send("Server error");
  }
});

// Delete Auction
router.delete("/:id", auth, async (req, res) => {
  try {
    let auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ msg: "Auction not found" });

    // Check if the user owns the auction
    if (auction.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await Auction.findByIdAndRemove(req.params.id);
    res.json({ msg: "Auction removed" });
  } catch (e) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
