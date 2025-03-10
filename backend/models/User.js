const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: String,
    deviceToken: String, // Unique identifier for push notifications
});

module.exports = mongoose.model("User", UserSchema);
