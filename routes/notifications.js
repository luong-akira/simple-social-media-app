const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Post = require("../models/post");
const Notification = require("../models/notification");
const auth = require("../middleware/auth");

router.get("/followers", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        let followers = user.followers;

        let followings = user.followings;
        let notification = await Notification.findOne({ user: req.user.id });
        if (!notification) {
            notification = new Notification({
                user: req.user.id,
            });
        }

        let followersImnotFollowing = [];

        for (let i in followers) {
            if (followings.includes(followers[i]) == false) {
                followersImnotFollowing.push(followers[i]);
            } else {
                console.log("not include");
            }
        }

        notification.followersNotif = followersImnotFollowing;

        await notification.save();

        res.status(200).send(notification);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get("/post", auth, async (req, res) => {
    try {
        const myPosts = await Post.find({ user: req.user.id });
        let notification = await Notification.findOne({ user: req.user.id });
        if (!notification) {
            notification = new Notification({
                user: req.user.id,
            });
        }

        let postNotifs = [];

        for (let i in myPosts) {
            const othersComments = myPosts[i].comments.filter(
                (p) => p.userId !== req.user.id
            );
            postNotifs.push({
                postId: String(myPosts[i]._id),
                othersComments,
            });
        }

        notification.postNotif = postNotifs;

        await notification.save();
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
