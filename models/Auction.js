const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AuctionSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startingBid: { type: Number, required: true },
  currentBid: { type: Number, default: 0 },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Auction", AuctionSchema);
