const express = require("express");
const http = require("http")
const app = express();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const server = http.createServer(app)
const mongoose = require('mongoose');
require('dotenv').config();

// const io = require("socket.io")(server, {
// 	cors: {
// 		origin: "http://localhost:3000",
// 		methods: [ "GET", "POST" ]
// 	}
// })


const jwt = require("jsonwebtoken");
const JWT_SECRET =
"vm1i2efiqdf9asdudefku333488@12=AlkLpuSsYASDKjFGd;Ap11OPW[]E'";

app.use(express.json());
app.use(cors());

const connectDB = require("./connectMongo");
connectDB();

// require("./userLoginDetails");
// require("./debateDetails");
// require("./debateRoom");

// const User = mongoose.model("users");
// const Debate = mongoose.model("debates");
// const DebateRoom = mongoose.model("debateRooms");

const UserDetailsSchema = require("./userLoginDetails");
const DebateDetailsSchema = require("./debateDetails");
const User = mongoose.model("User", UserDetailsSchema);
const Debate = mongoose.model("Debate", DebateDetailsSchema);
module.exports = { User, Debate };

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

// Route to create a new debate
app.post("/create-debate", async (req, res) => {
  const token = req.headers.authorization;
  const { topic, roundTime, numRounds, position, category } = req.body;
  try {
    console.log("Received token:", token);
    if (!token) {
      return res.status(401).send({ status: "Error", error: "Token not provided" });
    }

    // Extract the token without the "Bearer" prefix
    const tokenWithoutBearer = token.split(" ")[1];

    // Verify the JWT token to get the user's email
    const user = jwt.verify(tokenWithoutBearer, JWT_SECRET);
    console.log("Decoded user:", user); 
    const userEmail = user.email;

    // Find the user document using the email
    const userDoc = await User.findOne({ email: userEmail });
    if (!userDoc) {
      return res.status(404).send({ status: "Error", error: "User not found" });
    }

    const username = userDoc.username;

    // Create the debate room with user1 parameters
    await Debate.create({
      topic,
      roundTime,
      numRounds,
      category,
      user1Username: username, // Use the retrieved username
      user1Position: position,
    });
    res.send({ status: "Debate room created" });
  } catch (error) {
    console.error('Error creating debate room:', error);
    res.status(500).send({ status: "Error creating debate room" });
  }
});



app.post("/join-debate", async (req, res) => {
  const { debateId, user2Username, user2Position } = req.body;

  try {
    // Find the debate room by ID
    const debate = await Debate.findById(debateId);
    if (!debate) {
      return res.status(404).send({ status: "Error", error: "Debate room not found" });
    }

    // Update the debate room with user2 parameters
    debate.user2Username = user2Username;
    debate.user2Position = user2Position;
    await debate.save();

    res.send({ status: "User2 joined debate room successfully" });
  } catch (error) {
    console.error('Error joining debate room:', error);
    res.status(500).send({ status: "Error joining debate room" });
  }
});


// Route to retrieve debate room details by ID
app.get("/debates/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const debate = await Debate.findById(id);
    if (!debate) {
      return res.status(404).send({ status: "Error", error: "Debate not found" });
    }

    res.json({ debate });
  } catch (error) {
    console.error('Error fetching debate details:', error);
    res.status(500).send({ status: "Error fetching debate details" });
  }
});

//Socket IO
// io.on("connection", (socket) => {
// 	socket.emit("me", socket.id)

// 	socket.on("disconnect", () => {
// 		socket.broadcast.emit("callEnded")
// 	})

// 	socket.on("callUser", (data) => {
// 		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
// 	})

// 	socket.on("answerCall", (data) => {
// 		io.to(data.to).emit("callAccepted", data.signal)
// 	})
// })

// app.listen(5000, () => {
//   console.log("Server Started");
// });


const port = process.env.PORT;

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;