const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const User = require("../models/user");
const auth = require("../middleware/auth");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { findById } = require("../models/post");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            Date.now() + file.fieldname + "-" + path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage: storage });

// Create A Post
router.post("/", auth, upload.single("post_img"), async (req, res) => {
    try {
        let post;
        if (req.file) {
            post = await Post.create({
                user: req.user.id,
                post: req.body.post,
                image: `/${req.file.destination}${req.file.filename}`,
            });
        } else {
            post = await Post.create({
                user: req.user.id,
                post: req.body.post,
            });
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Get all followings post
router.get("/allposts", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            res.status(400).json({ msg: "User not found" });
            return;
        }
        const followings = user.followings;
        const followingsPlusAuthUser = [...followings, req.user.id];

        const posts = await Post.find({
            user: { $in: followingsPlusAuthUser },
        })
            .sort("-created_at")
            .populate("user comments.user");

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Get all posts from a user
router.get("/:id", async (req, res) => {
    try {
        const posts = await Post.find({ user: req.params.id })
            .sort("-created_at")
            .populate("user comments.user");
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Comment on a post
router.put("/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate(
            "comments.user"
        );
        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        post.comments.push({
            user: req.user.id,
            comment: req.body.comment,
        });

        await post.save();

        const createdPosts = await Post.findById(req.params.id).populate(
            "comments.user"
        );

        res.status(201).json(createdPosts);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Delete a post
router.delete("/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            res.status(404).json({ msg: "Post not found" });
            return;
        }

        if (post.user != req.user.id) {
            res.status(400).json({ msg: "Not authorized" });
            return;
        } else {
            if (post.image) {
                fs.unlink(path.join(__dirname, "../", post.image), () => {});
            }
            await Post.findByIdAndDelete(req.params.id);
        }
        res.status(200).json({ msg: "Delete successfully" });
    } catch (error) {
        res.status(500).json(error);
    }
});

//Like a post
router.put("/:id/like", auth, async (req, res) => {
    try {
        let post = await Post.findById(req.params.id).populate("likes");
        if (!post) {
            res.status(400).json({ msg: "Post not found" });
            return;
        }
        const isLiked = post.likes.find((l) => l == req.user.id);
        if (isLiked) {
            const likeIndex = post.likes.findIndex((l) => l == req.user.id);
            post.likes.splice(likeIndex, 1);
        } else {
            post.likes.push(req.user.id);
        }
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Dislike a post
router.put("/:id/dislike", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate("dislikes");

        if (!post) {
            res.status(400).json({ msg: "Post not found" });
            return;
        }
        const isDisLiked = post.dislikes.find((l) => l == req.user.id);
        if (isDisLiked) {
            const disLikeIndex = post.dislikes.findIndex(
                (l) => l == req.user.id
            );
            post.dislikes.splice(disLikeIndex, 1);
        } else {
            post.dislikes.push(req.user.id);
        }
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
