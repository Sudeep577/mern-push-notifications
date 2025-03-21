// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, Alert } from 'react-native';

// const SOCKET_URL = 'ws://192.168.2.133:5000'; // Replace with your PC's local IP

// const ScreenNotification = () => {
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     const ws = new WebSocket(SOCKET_URL);

//     ws.onopen = () => {
//       console.log('🔥 Connected to WebSocket');
//       ws.send('Mobile Connected!');
//     };  
   


//     ws.onmessage = (event) => {
//       const message = event.data;
//       console.log('📩 Message Received:', message);
//       Alert.alert('New Notification', message);
//     };

//     ws.onerror = (error) => {
//       console.error('❌ WebSocket Error:', error);
//     };

//     ws.onclose = () => {
//       console.log('🚫 WebSocket Disconnected');
//     };

//     setSocket(ws);

//     return () => {
//       ws.close();
//     };
//   }, []);

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>WebSocket Notification Example</Text>
//       <Button title="Send Test Notification" onPress={() => socket.send('New Push Notification!')} />
//     </View>
//   );
// };

// export default ScreenNotification;
import React, { useEffect, useState } from "react";

const SOCKET_URL = "ws://192.168.2.133:5000"; // Use your system's local IP

const ScreenNotification = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (socket) socket.close();
    };
  }, []);

  const connectWebSocket = () => {
    const ws = new WebSocket(SOCKET_URL);

    ws.onopen = () => {
      console.log("🔥 Connected to WebSocket");
      setIsConnected(true);
      ws.send("Client Connected! ✅");
    };

    ws.onmessage = (event) => {
      console.log("📩 Message Received:", event.data);
      setMessages((prev) => [...prev, event.data]);
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket Error:", error);
    };

    ws.onclose = () => {
      console.log("🚫 WebSocket Disconnected");
      setIsConnected(false);
      attemptReconnect();
    };

    setSocket(ws);
  };

  const attemptReconnect = () => {
    if (!isConnected) {
      console.log("🔄 Attempting to reconnect in 3 seconds...");
      setTimeout(() => {
        connectWebSocket();
      }, 3000);
    }
  };

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send("New Push Notification!");
      console.log("📤 Sent: New Push Notification!");
    } else {
      console.log("⚠️ WebSocket is not connected!");
      alert("WebSocket is not connected!");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>WebSocket Notification Example</h2>
      <p style={{ color: isConnected ? "green" : "red" }}>
        {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
      </p>
      <button onClick={sendMessage} disabled={!isConnected}>
        Send Notification
      </button>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default ScreenNotification;
