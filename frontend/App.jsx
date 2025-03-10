// import React, { useState, useEffect } from "react";
// import { View, Text, Button, StyleSheet } from "react-native";
// import WebSocketClient from "react-native-websockets";

// const App = () => {
//     const [messages, setMessages] = useState([]);
//     let ws;

//     useEffect(() => {
//         ws = new WebSocket("ws://localhost:8080");

//         ws.onopen = () => console.log("Connected to WebSocket Server");
//         ws.onmessage = (event) => setMessages((prev) => [...prev, event.data]);
//         ws.onerror = (error) => console.error("WebSocket Error:", error);
//         ws.onclose = () => console.log("WebSocket Disconnected");

//         return () => ws.close();
//     }, []);

//     const sendMessage = () => {
//         if (ws.readyState === WebSocket.OPEN) {
//             ws.send("New Push Notification!");
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Push Notifications</Text>
//             <Button title="Send Notification" onPress={sendMessage} />
//             {messages.map((msg, index) => (
//                 <Text key={index} style={styles.notification}>{msg}</Text>
//             ))}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, justifyContent: "center", alignItems: "center" },
//     title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
//     notification: { marginTop: 10, fontSize: 16, color: "green" },
// });

// export default App;
import React, { useState, useEffect, useRef } from "react";
import { View, Text, Button, StyleSheet, ScrollView, Alert } from "react-native";

// ⚠️ Use your local network IP if testing on a mobile device
const SERVER_URL = "ws://192.168.2.133:5000"; // Replace with your system's local IPv4

const App = () => {
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const ws = useRef(null); // WebSocket instance
    const reconnectInterval = useRef(null);

    useEffect(() => {
        connectWebSocket();

        return () => {
            if (ws.current) {
                ws.current.close();
            }
            if (reconnectInterval.current) {
                clearTimeout(reconnectInterval.current);
            }
        };
    }, []);

    const connectWebSocket = () => {
        ws.current = new WebSocket(SERVER_URL);

        ws.current.onopen = () => {
            console.log("✅ Connected to WebSocket Server");
            setIsConnected(true);
        };

        ws.current.onmessage = (event) => {
            console.log("📩 Message received:", event.data);
            setMessages((prev) => [...prev, event.data]);
            Alert.alert("New Notification", event.data);
        };

        ws.current.onerror = (error) => {
            console.error("❌ WebSocket Error:", error);
        };

        ws.current.onclose = () => {
            console.log("🚫 WebSocket Disconnected");
            setIsConnected(false);
            attemptReconnect();
        };
    };

    const attemptReconnect = () => {
        if (!isConnected) {
            console.log("🔄 Attempting to reconnect in 3 seconds...");
            reconnectInterval.current = setTimeout(() => {
                connectWebSocket();
            }, 3000);
        }
    };

    const sendMessage = () => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send("New Push Notification!");
            console.log("📤 Sent: New Push Notification!");
        } else {
            console.log("⚠️ WebSocket is not connected!");
            Alert.alert("Connection Error", "WebSocket is not connected!");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Push Notifications</Text>
            <Text style={[styles.connectionStatus, { color: isConnected ? "green" : "red" }]}> 
                {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
            </Text>
            <Button title="Send Notification" onPress={sendMessage} />
            <ScrollView style={styles.messageContainer}>
                {messages.map((msg, index) => (
                    <Text key={index} style={styles.notification}>{msg}</Text>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
    connectionStatus: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
    messageContainer: { width: "100%", marginTop: 10 },
    notification: { fontSize: 16, color: "green", padding: 5, borderBottomWidth: 1, borderBottomColor: "#ddd" },
});

export default App;