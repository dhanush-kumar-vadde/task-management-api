const notificationService = require("../services/notification.service");

const getNotifications = async (req, res, next) => {
  try {

    const notifications = await notificationService.getNotifications(
      req.user._id
    );

    res.json(notifications);

  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {

    const notification = await notificationService.markAsRead(
      req.params.id,
      req.user._id
    );

    res.json(notification);

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead
};