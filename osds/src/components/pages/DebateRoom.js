import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import "../DebateRoom.css";
import { api } from "../../App.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
function DebateRoom() {
  const { id } = useParams();
  const [debate, setDebate] = useState(null);
  const [user, setUser] = useState("");
  const [user1Position, setPosition1] = useState("");
  const [user2Position, setPosition2] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [randomUser, setRandomUser] = useState("");
  const [timerCount, setTimerCount] = useState(5);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [argumentInput, setArgumentInput] = useState("");
  const [socket, setSocket] = useState(null);
  const [proArguments, setProArguments] = useState([]);
  const [conArguments, setConArguments] = useState([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setIsLoggedIn(true);
      const fetchUserData = async () => {
        try {
          const response = await fetch(`${api}/userData`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: storedToken,
            }),
          });
          const data = await response.json();
          console.log("API Response:", data);
          if (data.status === "Valid") {
            setUser(data.data.username);
          } else {
            console.error("Error fetching username:", data.data);
          }
        } catch (error) {
          console.error("Error fetching username:", error);
        }
      };
      fetchUserData();
    }
  }, []);

  useEffect(() => {
    const fetchDebateDetails = async () => {
      try {
        const response = await fetch(`${api}/debates/${id}`);
        const data = await response.json();
        setDebate(data.debate);
        console.log("Debate details:", data.debate);
        setPosition1(data.debate.user1Position);
        setPosition2(data.debate.user1Position === "Pro" ? "Con" : "Pro");
        // Check if user2 has already joined the debate
        if (data.debate.user2Username === user) {
          setIsJoined(true);
        }
      } catch (error) {
        console.error("Error fetching debate details:", error);
      }
    };
    fetchDebateDetails();
  }, [user, id]);

  useEffect(() => {
    const newSocket = io(api, { query: { username: user } });
    // Listen for the 'connect' event to ensure the socket connection is established
    newSocket.on("connect", () => {
      console.log("Socket connection established:", newSocket.connected);
    });

    setSocket(newSocket);

    // Cleanup function
    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (socket) {
      // Listen for messages from the server
      socket.on("message", (message) => {
        console.log("Server sent message:", message);
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }
  }, [socket]);

  const sendMessage = () => {
    if (messageInput.trim() !== "") {
      // Send the message to the server
      setMessages((prevMessages) => [
        ...prevMessages,
        { username: user, message: messageInput }, // Assuming 'user' is your username
      ]);
      socket.emit("message", messageInput);
      setMessageInput("");
      console.log(socket);
    }
  };

  const sendArgument = async () => {
    if (user === debate.user1Username) {
      if (argumentInput.trim() !== "") {
        try {
          const response = await fetch(`${api}/save-arguments`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              debateID: id,
              proUser:
                debate.user1Position === "Pro"
                  ? debate.user1Username
                  : debate.user2Username,
              conUser:
                debate.user2Position === "Con"
                  ? debate.user2Username
                  : debate.user1Username,
              proArgs: user1Position === "Pro" ? [argumentInput] : [],
              conArgs: user1Position === "Con" ? [argumentInput] : [],
            }),
          });
          const data = await response.json();
          console.log("Argument saved:", data);
        } catch (error) {
          console.error("Error saving argument:", error);
        }
      }
    } else if (user === debate.user2Username) {
      if (argumentInput.trim() !== "") {
        try {
          const response = await fetch(`${api}/save-arguments`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              debateID: id,
              proUser:
                debate.user1Position === "Pro"
                  ? debate.user1Username
                  : debate.user2Username,
              conUser:
                debate.user2Position === "Con"
                  ? debate.user2Username
                  : debate.user1Username,
              proArgs: user2Position === "Pro" ? [argumentInput] : [],
              conArgs: user2Position === "Con" ? [argumentInput] : [],
            }),
          });
          const data = await response.json();
          console.log("Argument saved:", data);
        } catch (error) {
          console.error("Error saving argument:", error);
        }
      }
    }
    socket.emit("newArgument", { argument: argumentInput });
    setArgumentInput("");
  };

  const fetchArguments = async () => {
    try {
      const response = await fetch(`${api}/arguments/${id}`);
      const data = await response.json();
      setProArguments(data.proArgs || []);
      setConArguments(data.conArgs || []);
    } catch (error) {
      console.error("Error fetching arguments:", error);
    }
  };

  useEffect(() => {
    fetchArguments();
  }, [id]); // Call fetchArguments when the debate ID changes

  useEffect(() => {
    if (socket) {
      socket.on("newArgument", fetchArguments);
    }
  }, [socket]); // Call fetchArguments when a new argument is received via socket

  const handleJoinDebate = async () => {
    try {
      // Make a POST request to join the debate room as user2
      const response = await fetch(`${api}/join-debate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          debateId: id,
          user2Username: user,
          user2Position: user2Position,
        }),
      });
      const data = await response.json();
      if (data.status === "User2 joined debate room successfully") {
        // Update the debate state with the updated debate object
        setDebate(data.debate);
        setIsJoined(true);
        startTimer();
      } else {
        console.error("Error joining debate room:", data.error);
      }
    } catch (error) {
      console.error("Error joining debate room:", error);
    }
  };

  const handleSendMessage = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent the default behavior of the Enter key
      sendMessage();
    }
  };

  const handleSendArgument = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent the default behavior of the Enter key
      sendArgument();
    }
  };

  const startTimer = () => {
    setIsTimerRunning(true);
    const interval = setInterval(() => {
      setTimerCount((prevCount) => prevCount - 1);
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
      const randomUsername = Math.random() < 0.5 ? debate.user1Username : user;
      setRandomUser(randomUsername);
    }, 5000); // 5000 milliseconds (5 seconds)
  };

  const isCreatorOrOpponent = () => {
    return (
      debate && (user === debate.user1Username || user === debate.user2Username)
    );
  };

  return (
    <div className="debateroom__container">
      {debate ? (
        <>
          <h2>{debate.topic}</h2>
          <p>Debate ID: {id}</p>
          <div>
            {/* Display user1's username and position */}
            <p>
              Creator: {debate.user1Username} ({debate.user1Position})
            </p>
            {/* Display user2's username and position if present */}
            {debate.user2Username && (
              <p>
                Opponent: {debate.user2Username} ({debate.user2Position})
              </p>
            )}
            {isJoined && isTimerRunning && <p>Timer: {timerCount} seconds</p>}
            {randomUser && <p>{randomUser} is going first</p>}
            {/* Display join button if user2 has not joined and user is logged in */}
            {!isJoined && isLoggedIn && !isCreatorOrOpponent() && (
              <button onClick={handleJoinDebate}>Join</button>
            )}
            <div className="arguments-container">
              <div className="arguments">
                <h3>Pro Arguments:</h3>
                <ul>
                  {proArguments.map((arg, index) => (
                    <li key={index}>{arg}</li>
                  ))}
                </ul>
              </div>
              <div className="arguments">
                <h3>Con Arguments:</h3>
                <ul>
                  {conArguments.map((arg, index) => (
                    <li key={index}>{arg}</li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Display timer and random user if present */}

            {isCreatorOrOpponent() && (
              <div className="argument-input-container">
                <textarea
                  value={argumentInput}
                  onChange={(e) => setArgumentInput(e.target.value)}
                  onKeyDown={handleSendArgument}
                  placeholder="Enter your argument here..."
                />
                <button onClick={sendArgument}><FontAwesomeIcon className="play" icon={faArrowRight} /></button>
              </div>
            )}
          </div>
        </>
      ) : (
        <p>Debate details are not available.</p>
      )}
      <div className="chat-container">
        <div className="message-container">
          {messages.map((message, index) => (
            <div key={index} className="message">
              <p>
                {message.username}: {message.message}
              </p>
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleSendMessage}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default DebateRoom;
