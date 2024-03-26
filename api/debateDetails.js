const mongoose = require("mongoose");

const DebateDetailsSchema = new mongoose.Schema(
  {
    topic: String,
    roundTime: Number,
    numRounds: Number,
    position: String,
    category: String,
    // You can add more fields as needed
  },
  {
    collection: "debates", // Specify the collection name
  }
);

mongoose.model("debates", DebateDetailsSchema);
