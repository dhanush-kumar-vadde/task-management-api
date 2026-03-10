const Notification = require("../models/notification.model");

const createNotification = async (data) => {

  return Notification.create(data);

};

const getNotifications = async (userId) => {

  return Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(50);

};

const markAsRead = async (id, userId) => {

  const notification = await Notification.findOne({
    _id: id,
    userId
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  notification.read = true;

  await notification.save();

  return notification;
};

module.exports = {
  createNotification,
  getNotifications,
  markAsRead
};