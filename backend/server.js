// require("dotenv").config(); // Load environment variables
// const express = require("express");
// const connectDB = require("./config/db");
// const cors = require("cors");

// const app = express();

// // Middleware
// app.use(express.json()); // Parse JSON request bodies
// app.use(cors()); // Enable CORS for all routes

// // Connect Database
// connectDB();

// // Routes
// app.use("/api/notifications", require("./routes/notificationRoutes"));

// // Error handling middleware (optional but recommended)
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: "Something went wrong!" });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



// require("dotenv").config();
// const express = require("express");
// const connectDB = require("./config/db");
// const cors = require("cors");
// const http = require("http");
// const WebSocket = require("ws");

// const app = express();
// const server = http.createServer(app); // Create an HTTP server
// const wss = new WebSocket.Server({ server }); // Attach WebSocket Server

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Connect Database
// connectDB();

// // Routes
// app.use("/api/notifications", require("./routes/notificationRoutes"));

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error("❌ Error:", err.stack);
//   res.status(500).json({ message: "Something went wrong!" });
// });

// // WebSocket Handling
// wss.on("connection", (ws) => {
//   console.log("🔥 Client connected to WebSocket");

//   ws.on("message", (message) => {
//     const textMessage = message.toString(); // Convert Buffer to String
//     console.log("📩 Received:", textMessage);
    
//     // Send acknowledgment to sender
//     ws.send("✅ Server received: " + textMessage);

//     // Broadcast message to all connected clients
//     wss.clients.forEach((client) => {
//       if (client !== ws && client.readyState === WebSocket.OPEN) {
//         client.send(`🔔 Notification: ${textMessage}`);
//       }
//     });
//   });

//   ws.on("error", (error) => console.error("❌ WebSocket Error:", error));
//   ws.on("close", () => console.log("🚫 Client disconnected"));
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app); // Create an HTTP server
const wss = new WebSocket.Server({ server }); // Attach WebSocket Server

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" })); // Allow all origins for WebSocket

// Connect Database
connectDB();

// Routes
app.use("/api/notifications", require("./routes/notificationRoutes"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// 🟢 WebSocket Handling
wss.on("connection", (ws, req) => {
    console.log("🔥 Client connected to WebSocket");

    // Send a welcome message to the connected client
    ws.send("🔗 Connected to WebSocket Server!");

    // Handle incoming messages
    ws.on("message", (message) => {
        const textMessage = message.toString(); // Convert Buffer to String
        console.log("📩 Received:", textMessage);

        // Broadcast message to all connected clients (including sender)
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(`🔔 Notification: ${textMessage}`);
            }
        });
    });

    // Handle WebSocket errors
    ws.on("error", (error) => {
        console.error("❌ WebSocket Error:", error);
    });

    // Handle WebSocket disconnection
    ws.on("close", () => {
        console.log("🚫 Client disconnected");
    });

    // Keep WebSocket connection alive (ping-pong mechanism)
    const interval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.ping();
        } else {
            clearInterval(interval);
        }
    }, 30000); // Every 30 seconds
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
