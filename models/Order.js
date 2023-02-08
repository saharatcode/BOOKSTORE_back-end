const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    email: { type: String},
    products: {type: Array},
    netPrice: { type: Number, required: true },
    address: { type: String, required: true },
    status: { type: String, default: "Pending payment" },
    paymentStatus: { type: Boolean, default: false },
    paymentUrl: { type: String},
    trackNumber: { type: String},
    transportBy: { type: String, required: true },
    deliveryFee: { type: Number, required: true },
    sessionId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);