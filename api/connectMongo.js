const mongoose = require('mongoose')

const connectDB = async () => {
mongoose
.connect(process.env.MONGODB_CONNECT_URI, {
  useNewUrlParser: true,
  dbName: "osds",
})
.then(() => {
  console.log("Connected to the database");
})
.catch((e) => console.log(e));}

module.exports = connectDB