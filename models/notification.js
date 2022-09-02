const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  followersNotif: {
    type: Array,
  },
  postNotif: [
    {
      postId: String,
      othersComments: Array,
    },
  ],
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
