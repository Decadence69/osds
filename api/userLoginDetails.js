const mongoose = require("mongoose");

const UserDetailsSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    username: { type: String, unique: true },
    password: String,
  },
  {
    collection: "users",
  }
);

mongoose.model("users", UserDetailsSchema);
