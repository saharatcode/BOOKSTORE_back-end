const mongoose = require("mongoose");

const AdressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    fullName: { type: String },
    tel: { type: String },
    village: { type: String },
    subDistrict: { type: String },
    district: { type: String },
    province: { type: String },
    postalCode: { type: String },
    isMainAdress: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Adress", AdressSchema);