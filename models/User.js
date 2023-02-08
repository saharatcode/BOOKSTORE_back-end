const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {

    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber:{type: String},
    birthday :{type: String},
    gender :{type: String},
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);