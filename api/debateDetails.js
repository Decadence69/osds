const mongoose = require("mongoose");

const DebateDetailsSchema = new mongoose.Schema(
  {
    topic: String,
    roundTime: Number,
    numRounds: Number,
    user1Username: String,
    user2Username: { type: String, required: false }, // User2 username can be nullable
    user1Position: String,
    user2Position: { type: String, required: false }, // User2 position can be nullable
    user2JoinTime: { type: Date, default: null },
    status: { type: String, default: "active" },
    proVotes: { type: Number, default: 0 },
    conVotes: { type: Number, default: 0 },
    voters: [{ type: String }],
  },
  {
    collection: "debates", // Specify the collection name
  }
);

// mongoose.model("debates", DebateDetailsSchema);
module.exports = mongoose.model("debates", DebateDetailsSchema);
module.exports = DebateDetailsSchema;
