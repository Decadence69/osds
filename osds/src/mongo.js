const mongoose = require("mongoose");
const mongoPath =
  "mongodb+srv://admin:fXeirIT92H5YQ6XV@osdsdb.avbhzhh.mongodb.net/?retryWrites=true&w=majority&appName=osds";

//fXeirIT92H5YQ6XV

// module.exports = async () => {
//   await mongoose.connect(mongoPath, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });

//   return mongoose;
// };

mongoose
  .connect("mongodb://localhost:27017/user")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch(() => {
    console.log("Failed");
  });

const newSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const collection = mongoose.model("collection", newSchema)

module.exports=collection


