const mongoose = require("mongoose");

const DebateArgsSchema = new mongoose.Schema({
  debateID: {
    type: String,
    required: true,
  },
  proUser: {
    type: String,
    required: true,
  },
  conUser: {
    type: String,
    required: true,
  },
  proArgs: {
    type: [String],
    default: [],
  },
  conArgs: {
    type: [String],
    default: [],
  }
},{
    collection: "debateArgs",
  });

module.exports = mongoose.model("debateArgs", DebateArgsSchema);
module.exports = DebateArgsSchema;
