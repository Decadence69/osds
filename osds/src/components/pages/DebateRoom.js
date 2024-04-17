// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import "../DebateRoom.css";

// function DebateRoom() {
//   const { id } = useParams(); // Access the ID parameter from the URL
//   const [debate, setDebate] = useState(null); // State to store debate details
//   const [user, setUser] = useState(""); // State to store the current user's username
//   const [position, setPosition] = useState(""); // State to store the current user's position (Pro or Con)
//   const [isLoggedIn, setIsLoggedIn] = useState(false); // New state to track login status
//   const [isJoined, setIsJoined] = useState(false); // State to track whether the user has joined
//   const [isTimerRunning, setIsTimerRunning] = useState(false); // State to track whether the timer is running
//   const [randomUser, setRandomUser] = useState(""); // State to store the randomly selected username
//   const [timerCount, setTimerCount] = useState(5); // State to store the timer count

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     if (storedToken) {
//       setIsLoggedIn(true);
//       const fetchUsername = async () => {
//         try {
//           const response = await fetch("http://localhost:5000/userData", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ token: storedToken }),
//           });
//           const data = await response.json();
//           if (data.status === "Valid") {
//             setUser(data.data.username);
//           } else {
//             console.error("Error fetching username:", data.data);
//           }
//         } catch (error) {
//           console.error("Error fetching username:", error);
//         }
//       };
//       fetchUsername();
//     }
//   }, []);

//   useEffect(() => {
//     const fetchDebateDetails = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/debates/${id}`);
//         const data = await response.json();
//         setDebate(data.debate);
//       } catch (error) {
//         console.error("Error fetching debate details:", error);
//       }
//     };
//     fetchDebateDetails();
//   }, [id]);

//   useEffect(() => {
//     const fetchUser2Details = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/debates/${id}`);
//         const data = await response.json();
//         const { user2Username, user2Position } = data.debate;
//         if (user2Username && user2Position) {
//           setUser(user2Username);
//           setPosition(user2Position);
//           setIsJoined(true);
//           startTimer(); // Start the timer once the user joins
//         }
//       } catch (error) {
//         console.error("Error fetching user2 details:", error);
//       }
//     };
//     fetchUser2Details();
//   }, [id]);

//   const handleJoinDebate = async () => {
//     // Determine the opposite position from the creator
//     const oppositePosition = debate.creatorPosition === "Pro" ? "Con" : "Pro";
//     setPosition(oppositePosition);

//     try {
//       // Make a POST request to join the debate room as user2
//       const response = await fetch("http://localhost:5000/join-debate", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           debateId: id,
//           user2Username: user,
//           user2Position: oppositePosition,
//         }),
//       });
//       const data = await response.json();
//       setIsJoined(true); // Set isJoined to true when user joins
//       startTimer(); // Start the timer when the user joins
//       console.log(data);
//     } catch (error) {
//       console.error("Error joining debate room:", error);
//     }
//   };

//   const startTimer = () => {
//     setIsTimerRunning(true);
//     const interval = setInterval(() => {
//       setTimerCount((prevCount) => prevCount - 1);
//     }, 1000);
//     setTimeout(() => {
//       clearInterval(interval);
//       const randomUsername = Math.random() < 0.5 ? debate.username : user;
//       setRandomUser(randomUsername);
//     }, 5000); // 5000 milliseconds (5 seconds)
//   };

//   return (
//     <div className="debateroom__container">
//       {debate ? (
//         <>
//           <h2>{debate.topic}</h2>
//           <p>Creator: {debate.username}</p>
//           <p>Debate ID: {id}</p>
//           <div>
//             {/* Display current user's username and position */}
//             {isLoggedIn && (
//               <p>
//                 {user} ({position})
//               </p>
//             )}
//             {!isJoined && isLoggedIn && (
//               <button onClick={handleJoinDebate}>Join</button>
//             )}
//             {/* Display timer and user2's username if present */}
//             {isJoined && isTimerRunning && <p>Timer: {timerCount} seconds</p>}
//             {randomUser && <p>{randomUser} is going first</p>}
//           </div>
//         </>
//       ) : (
//         <p>Debate details are not available.</p>
//       )}
//     </div>
//   );
// }

// export default DebateRoom;

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Peer from "simple-peer"
import "../DebateRoom.css";
import {api} from "../../App.js";

// const socket = io.connect("http://localhost:5000");

function DebateRoom() {
  const { id } = useParams();
  const [debate, setDebate] = useState(null);
  const [user, setUser] = useState("");
  const [position, setPosition] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [randomUser, setRandomUser] = useState("");
  const [timerCount, setTimerCount] = useState(5);
  const [stream, setStream] = useState();
  const userAudio = useRef();
  const connectionRef = useRef();

  // useEffect(() => {
  //   navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
  //     setStream(stream);
  //     userAudio.current.srcObject = stream;
  //   });

  //   socket.on("callAccepted", () => {
  //     setCallAccepted(true);
  //     setIsTimerRunning(true); // Start the timer when call is accepted
  //   });

  //   socket.on("endCall", () => {
  //     setCallEnded(true);
  //     connectionRef.current.destroy();
  //   });
  // }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setIsLoggedIn(true);
      const fetchUserData = async () => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          setIsLoggedIn(true);
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
        // Check if user2 has already joined the debate
        if (data.debate.user2Username && data.debate.user2Position) {
          setUser(data.debate.user2Username);
          setPosition(data.debate.user2Position);
          setIsJoined(true);
        }
      } catch (error) {
        console.error("Error fetching debate details:", error);
      }
    };
    fetchDebateDetails();
  }, [id]);

  

  const handleJoinDebate = async () => {
    // Determine the opposite position from the creator
    const oppositePosition = debate.user1Position === "Pro" ? "Con" : "Pro";
    setPosition(oppositePosition);
  
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
          user2Position: oppositePosition,
        }),
      });
      const data = await response.json();
      
      // Set isJoined to true when user joins
      
      // Start the call when the user joins
      // startCall();
  
      // Update user2's username and position after state has been updated
      setUser(data.user2Username);
      setPosition(data.user2Position);
      setIsJoined(true);
  
      // Start the timer when the user joins
      startTimer();
    } catch (error) {
      console.error("Error joining debate room:", error);
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

  // const startCall = () => {
  //   const peer = new Peer({
  //     initiator: true,
  //     trickle: false,
  //     stream: stream,
  //   });

  //   peer.on("signal", (data) => {
  //     socket.emit("callUser", { signal: data });
  //   });

  //   peer.on("stream", (stream) => {
  //     userAudio.current.srcObject = stream;
  //   });

  //   socket.on("offerSignal", (signal) => {
  //     peer.signal(signal);
  //   });

  //   connectionRef.current = peer;
  // };

  // const endCall = () => {
  //   socket.emit("endCall");
  //   connectionRef.current.destroy();
  // };

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
              {console.log(debate.user2Username)}
            {debate.user2Username && (
              <p>
                Opponent: {debate.user2Username} ({debate.user2Position})
              </p>
            )}
            {/* Display join button if user2 has not joined and user is logged in */}
            {!isJoined && isLoggedIn && (
              <button onClick={handleJoinDebate}>Join</button>
            )}
            {/* Display timer and random user if present */}
            {isJoined && isTimerRunning && <p>Timer: {timerCount} seconds</p>}
            {randomUser && <p>{randomUser} is going first</p>}
            {/* <audio ref={userAudio} autoPlay muted></audio> */}
          </div>{console.log("Done")}
        </>
      ) : (
        <p>Debate details are not available.</p>
      )}
    </div>
  );
}

export default DebateRoom;
