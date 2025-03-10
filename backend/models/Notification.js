const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    title: String,
    message: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", NotificationSchema);
