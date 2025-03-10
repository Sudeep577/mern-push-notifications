const Notification = require("../models/Notification");

exports.sendNotification = async (req, res) => {
    try {
        const { title, message, userId } = req.body;
        const notification = new Notification({ title, message, userId });
        await notification.save();
        res.status(201).json({ success: true, notification });
    } catch (error) {
        res.status(500).json({ error: "Error sending notification" });
    }
};

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });
        res.status(200).json({ notifications });
    } catch (error) {
        res.status(500).json({ error: "Error fetching notifications" });
    }
};
