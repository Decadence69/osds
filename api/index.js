const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const JWT_SECRET =
"vm1i2efiqdf9asdudefku333488@12=AlkLpuSsYASDKjFGd;Ap11OPW[]E'";

app.use(express.json());
app.use(cors());

const mongoUrl =
"mongodb+srv://admin:fXeirIT92H5YQ6XV@osdsdb.avbhzhh.mongodb.net/?retryWrites=true&w=majority&appName=OSDSDB";

mongoose
.connect(mongoUrl, {
  useNewUrlParser: true,
  dbName: "osds",
})
.then(() => {
  console.log("Connected to the database");
})
.catch((e) => console.log(e));

require("./userLoginDetails");
require("./debateDetails");

const User = mongoose.model("users");
const Debate = mongoose.model("debates");

app.post("/signup", async (req, res) => {
  const { email, username, password } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });

    if (existingEmail || existingUsername) {
      return res.json({ error: "Email or Username already exists" });
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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({email})
  if (!user) {
    return res.json({ error: "User not found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({email: user.email}, JWT_SECRET);

    if (res.status(201)) {
      return res.json({ status: "Success", data: token });
    } else {
      return res.json({ error: "Error" });
    }
  }
  res.json({ status: "Error", error: "Invalid Password" });
});

app.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);

    const useremail = user.email;
    User.findOne({ email: useremail })
      .then((data) => {
        res.send({ status: "Valid", data: data });
      })
      .catch((error) => {
        res.send({ status: "Error", data: error });
      });
  } catch (error) {}
});

// Route to create a new debate
app.post("/create-debate", async (req, res) => {
  const { topic, roundTime, numRounds, position, category } = req.body;

  try {
    await Debate.create({
      topic,
      roundTime,
      numRounds,
      position,
      category,
    });
    res.send({ status: "Debate created" });
  } catch (error) {
    res.status(500).send({ status: "Error creating debate" });
  }
});

// Route to get all debates
app.get('/debates', async (req, res) => {
  try {
    const debates = await Debate.find(); // Assuming 'Debate' is your Mongoose model
    res.json(debates);
  } catch (error) {
    console.error('Error fetching debates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add routes for updating and deleting debates as needed

app.listen(5000, () => {
  console.log("Server Started");
});