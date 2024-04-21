const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const app = express();
const bcrypt = require("bcryptjs");
const server = http.createServer(app);
const jwt = require("jsonwebtoken");
const cors = require("cors");
const connectDB = require("./connectMongo");

require("dotenv").config();

const socket = require("socket.io");
const io = new socket.Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

connectDB();

const JWT_SECRET =
  "vm1i2efiqdf9asdudefku333488@12=AlkLpuSsYASDKjFGd;Ap11OPW[]E'";
// require("./userLoginDetails");
// require("./debateDetails");
// require("./debateRoom");

// const User = mongoose.model("users");
// const Debate = mongoose.model("debates");
// const DebateRoom = mongoose.model("debateRooms");

const UserDetailsSchema = require("./userLoginDetails");
const DebateDetailsSchema = require("./debateDetails");
const DebateArgsSchema = require("./debateArgs");
const User = mongoose.model("User", UserDetailsSchema);
const Debate = mongoose.model("Debate", DebateDetailsSchema);
const DebateArgs = mongoose.model("DebateArgs", DebateArgsSchema);

module.exports = { User, Debate, DebateArgs };

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
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "User not found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET);

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
app.get("/debates", async (req, res) => {
  try {
    const debates = await Debate.find(); // Assuming 'Debate' is your Mongoose model
    res.json(debates);
  } catch (error) {
    console.error("Error fetching debates:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to create a new debate
app.post("/create-debate", async (req, res) => {
  const token = req.headers.authorization;
  const { topic, roundTime, numRounds, position, category } = req.body;
  try {
    console.log("Received token:", token);
    if (!token) {
      return res
        .status(401)
        .send({ status: "Error", error: "Token not provided" });
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
    console.error("Error creating debate room:", error);
    res.status(500).send({ status: "Error creating debate room" });
  }
});

// Route to retrieve debate room details by ID
app.get("/debates/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const debate = await Debate.findById(id);
    if (!debate) {
      return res
        .status(404)
        .send({ status: "Error", error: "Debate not found" });
    }

    res.json({ debate });
  } catch (error) {
    console.error("Error fetching debate details:", error);
    res.status(500).send({ status: "Error fetching debate details" });
  }
});

app.post("/join-debate", async (req, res) => {
  const { debateId, user2Username, user2Position } = req.body;

  try {
    // Find the debate room by ID
    const debate = await Debate.findById(debateId);
    if (!debate) {
      return res
        .status(404)
        .send({ status: "Error", error: "Debate room not found" });
    }

    // Update the debate room with user2 parameters
    debate.user2Username = user2Username;
    debate.user2Position = user2Position;
    await debate.save();

    const updatedDebate = await Debate.findById(debateId);

    res.send({
      status: "User2 joined debate room successfully",
      debate: updatedDebate,
    });
  } catch (error) {
    console.error("Error joining debate room:", error);
    res.status(500).send({ status: "Error joining debate room" });
  }
});

// Route to save an argument to the database
app.post("/save-arguments", async (req, res) => {
  const { debateID, proUser, conUser, proArgs, conArgs } = req.body;
  console.log(req.body);
  try {
    let debate = await DebateArgs.findOne({ debateID });

    if (!debate) {
      // If the debate ID doesn't exist, create a new record
      debate = await DebateArgs.create({
        debateID,
        proUser,
        conUser,
        proArgs,
        conArgs,
      });
    } else {
      // If the debate ID already exists, update the record by appending arguments

      debate.proArgs.push(...proArgs);
      debate.conArgs.push(...conArgs);
      await debate.save();
    }

    res.json({ status: "Arguments saved", debate });
  } catch (error) {
    console.error("Error saving arguments:", error);
    res.status(500).json({ status: "Error saving arguments" });
  }
});

const userSocketMap = {}; // {username: socketId}

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  const username = socket.handshake.query.username;
  console.log("Received username from handshake:", username);

  if (username !== undefined) {
    userSocketMap[socket.id] = username;
  } else {
    console.log("Username is undefined for socket ID:", socket.id);
  }

  // Emit the list of online users to all clients
  io.emit("getOnlineUsers", Object.values(userSocketMap));

  // Listen for incoming messages from clients
  socket.on("message", (message) => {
    console.log("Received message from", username, ":", message);
    // Broadcast the message to all clients except the sender
    socket.broadcast.emit("message", { username, message });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
    // Remove the username from the stored socket map
    delete userSocketMap[socket.id];
    // Emit the updated list of online users to all clients
    io.emit("getOnlineUsers", Object.values(userSocketMap));
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;
