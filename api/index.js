const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

app.use(express.json());
app.use(cors());

const mongoUrl =
  "mongodb+srv://admin:fXeirIT92H5YQ6XV@osdsdb.avbhzhh.mongodb.net/?retryWrites=true&w=majority&appName=OSDSDB";

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((e) => console.log(e));

require("./userLoginDetails");

const User = mongoose.model("users");

app.listen(5000, () => {
  console.log("Server Started");
});

app.post("/register", async (req, res) => {
  const { email, username, password } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    const existingEmail = await User.findOne({ email });
    // const existingUsername = await User.findOne({ email });

    if (existingEmail /*|| existingUsername*/) {
      return res.send({ error: "Email Exists" });
    }
    await User.create({
      email,
      username,
      password: encryptedPassword,
    });
    res.send({ status: "Created" });
  } catch (error) {
    res.send({ status: "Something went wrong, please try again" });
  }
});

// app.post("/post", async (req, res) => {
//   console.log(req.body);
//   const { data } = req.body;

//   try {
//     if (data == "test") {
//       res.send({ status: "Exists" });
//     } else {
//       res.send({ status: "Does not Exist" });
//     }
//   } catch (error) {
//     res.send({ status: "Something went wrong, please try again" });
//   }
// });

// const Express = require("express");
// const Mongoclient = require("mongodb").MongoClient;
// const cors = require("cors");
// const multer=require("multer")

// const app=Express();
// app.use(cors());

// const CONNECTION_STRING="mongodb+srv://admin:fXeirIT92H5YQ6XV@osdsdb.avbhzhh.mongodb.net/?retryWrites=true&w=majority&appName=OSDSDB"

// var DATABASENAME = "users"
// var database;

// app.listen(5000,()=>{
//     Mongoclient.connect(CONNECTION_STRING,(error,client)=>{
//         database=client.db(DATABASENAME)
//         console.log("Mongo DB Connection Succesful");
//     });
// })

// app.get('/osds/users/GetUsers',(request,response)=>{
//     database.collection("users").find({}).toArray((error,result)=>{
//         response.send(result);
//     })
// })

// app.post('/osds/users/AddUsers',multer().none(),(request,response)=>{
//     database.collection("users").count({},function(error,numOfDocs){
//         database.collection("users").insertOne({
//             id:(numOfDocs+1).toString(),
//             description:request.body.newNotes
//         });
//         response.json("Added Successfully");
//     })
// })

// app.delete('/osds/users/DeleteUsers',(request,response)=>{
//     database.collection("users").deleteOne({
//         id:request.query.id
//     })
//     response.json("Delete Successfully")
// })
