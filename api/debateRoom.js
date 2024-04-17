// const mongoose = require("mongoose");

// const DebateRoomSchema = new mongoose.Schema(
//   {
//     debateId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Debate',
//       required: true
//     },
//     user1Id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true
//     },
//     user2Id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true
//     },
//     user1Username: {
//       type: String,
//       required: true
//     },
//     user2Username: {
//       type: String,
//       required: true
//     },
//     user1Position: {
//       type: String,
//       enum: ['Pro', 'Con'], // Assuming Pro and Con are the only possible positions
//       required: true
//     },
//     user2Position: {
//       type: String,
//       enum: ['Pro', 'Con'], // Assuming Pro and Con are the only possible positions
//       required: true
//     },
//     // You can add more fields as needed
//   },
//   {
//     collection: "debateRooms", // Specify the collection name
//     timestamps: true // Automatically add createdAt and updatedAt fields
//   }
// );

// module.exports = mongoose.model("debateRooms", DebateRoomSchema);
