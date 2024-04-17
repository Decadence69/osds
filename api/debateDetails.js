const mongoose = require("mongoose");

const DebateDetailsSchema = new mongoose.Schema(
  {
    topic: String,
    roundTime: Number,
    numRounds: Number,
    category: String,
    user1Username: String,
    user2Username: { type: String, required: false }, // User2 username can be nullable
    user1Position: String,
    user2Position: { type: String, required: false }, // User2 position can be nullable
  },
  {
    collection: "debates", // Specify the collection name
  }
);

mongoose.model("debates", DebateDetailsSchema);
// module.exports = mongoose.model("debates", DebateDetailsSchema);
// module.exports = DebateDetailsSchema;