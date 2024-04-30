//Programmer Name: Ivan Chen Xiao Yu TP064261
//Program Name: osds
//First Written on: 15th March 2024
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
    origin: true,
    credentials: true
  },
});
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

connectDB();

// app.use(cors({
//   origin: 'https://osds.vercel.app',
//   methods: ['GET', 'POST'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));



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
  const { topic, roundTime, numRounds, position } = req.body;
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
  const { debateId, user2Username, user2Position, user2JoinTime } = req.body;

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
    debate.user2JoinTime = user2JoinTime;
    await debate.save();

    io.in(debateId).emit("userJoined", user2Username);

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

// Add a new route to retrieve arguments by debate ID
app.get("/arguments/:debateID", async (req, res) => {
  const { debateID } = req.params;

  try {
    const debateArgs = await DebateArgs.findOne({ debateID });
    if (!debateArgs) {
      return res.status(404).json({ error: "Debate arguments not found" });
    }

    const { proArgs, conArgs } = debateArgs;
    res.json({ proArgs, conArgs });
  } catch (error) {
    console.error("Error retrieving arguments:", error);
    res.status(500).json({ error: "Error retrieving arguments" });
  }
});

app.post('/vote', async (req, res) => {
  const { debateId, side, username } = req.body;

  try {
    // Find the debate
    const debate = await Debate.findById(debateId);
    if (!debate) {
      return res.status(404).json({ error: 'Debate not found' });
    }

    // Check if the user has already voted
    if (debate.voters.includes(username)) {
      return res.status(400).json({ error: 'User has already voted' });
    }

    // Update vote count and add voter username
    if (side === 'pro') {
      debate.proVotes += 1;
    } else if (side === 'con') {
      debate.conVotes += 1;
    }
    debate.voters.push(username);

    // Save the updated debate
    await debate.save();

    res.json({ message: 'Vote recorded successfully' });
  } catch (error) {
    console.error('Error recording vote:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get vote count endpoint
app.get('/vote-count/:debateId', async (req, res) => {
  const debateId = req.params.debateId;

  try {
    const debate = await Debate.findById(debateId);
    if (!debate) {
      return res.status(404).json({ error: 'Debate not found' });
    }

    res.json({ proVotes: debate.proVotes, conVotes: debate.conVotes });
  } catch (error) {
    console.error('Error fetching vote count:', error);
    res.status(500).json({ error: 'Internal server error' });
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

  socket.on("newArgument", ({ argument }) => {
    // Broadcast the new argument to all connected clients
    io.emit("newArgument", { argument });
  });

  socket.on("joinRoom", async (debateId) => {
    try {
      console.log("User joined room:", socket.id, debateId);
      // Fetch the debate room from the database
      const debate = await Debate.findById(debateId);
      if (!debate) {
        console.error("Debate not found");
        return;
      }

      // Make the socket join the room corresponding to the debate ID
      socket.join(debateId);

      // Start the timer for the debate room using the join time
      console.log("Debate ID:", debate._id.toString());
      if (debate.user2Username) {
        handleTimer(io, debate);
        const initialTimeRemaining = calculateInitialTimeRemaining(debate); 
        socket.emit("timerUpdate", { timeRemaining: initialTimeRemaining });
      } else {
        console.log("Waiting for user2 to join...");
      }
    } catch (error) {
      console.error("Error joining room:", error);
    }
  });

  function calculateInitialTimeRemaining(debate) {
    const { roundTime, user2JoinTime } = debate;
    
     // Convert round time to milliseconds
    const roundTimeMilliseconds = roundTime * 1000;
    const currentTime = new Date();

    // Calculate elapsed time since user2 joined
    const elapsedTime = currentTime - new Date(user2JoinTime); 

    // Calculate initial time remaining
    const timeRemaining = roundTimeMilliseconds - elapsedTime; 

    // Ensure time remaining is not negative
    return Math.max(0, timeRemaining); 
  }

  // Calculate time remaining for each round
  function calculateTimeRemaining(roundTimeMilliseconds, user2JoinTime) {
    const currentTime = new Date();
    const elapsedTime = currentTime - user2JoinTime;
    
    // Convert milliseconds to seconds
    const timeRemaining = roundTimeMilliseconds - elapsedTime; 
    console.log("Time remaining:", timeRemaining);
    if (timeRemaining <= 0) {
      // If time remaining is negative, return 0 to ensure the timer continues
      return 0;
    }

    return timeRemaining;
  }

  // Function to handle timer for each debate room
  function handleTimer(io, debate) {
    if (debate.status === "done") {
      console.log("Debate is already marked as done. Timer will not start.");
      return;
    }

    const { roundTime, numRounds, user2JoinTime } = debate;
    const roundTimeMilliseconds = roundTime * 1000;
    let intervalId;
    let remainingRounds = numRounds;
    let joinTime = new Date(user2JoinTime);
    let currentRound = 1;
    // Function to handle the timer interval
    function updateTimer() {
      const currentTime = new Date();
      let timeRemaining = calculateTimeRemaining(
        roundTimeMilliseconds,
        joinTime,
        currentTime
      );
      // If time remaining is 0 or negative, reset the timer for the next round
      if (timeRemaining <= 0) {
        // If there are more rounds remaining, reset the timer for the next round
        if (remainingRounds > 1) {
          remainingRounds -= 1;
          currentRound += 1;
          joinTime = new Date();
          // Reset time remaining to round time
          timeRemaining = roundTimeMilliseconds;
        } else {
          timeRemaining = 0;
          io.in(debate._id.toString()).emit("timerUpdate", {
            timeRemaining,
            currentRound,
          });
          clearInterval(intervalId); // Stop the timer if no more rounds remaining
          debate.status = "done"; // Mark the debate as done
          debate.save();
          return;
        }
      }

      // Emit updated time remaining to all users in the debate room
      io.in(debate._id.toString()).emit("timerUpdate", {
        timeRemaining,
        currentRound,
      });
    }

    // Initial update of the timer
    updateTimer();

    // Interval to update the timer every second
    intervalId = setInterval(updateTimer, 1000);
  }
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;
