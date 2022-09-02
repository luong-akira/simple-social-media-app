const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const auth = require("../middleware/auth");

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

// Register
router.post("/register", upload.single("avatar"), async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userExist = await User.findOne({ email });
        if (userExist) {
            res.status(400).json({ msg: "User has already existed" });
            return;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        let user;

        if (req.file != undefined) {
            user = await User.create({
                username,
                email,
                password: hashedPassword,
                profilePicture: `/${req.file.destination}${req.file.filename}`,
            });
        } else {
            user = await User.create({
                username,
                email,
                password: hashedPassword,
            });
        }

        const token = user.generateToken();
        res.status(201).json({ ...user._doc, token });
    } catch (error) {
        res.status(500).json(error);
    }
});

//Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: "Invalid Credentials" });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({ msg: "Invalid Credentials" });
        }

        const token = user.generateToken();

        res.status(200).json({ ...user._doc, token });
    } catch (error) {
        res.status(500).json(error);
    }
});

//Get logged in user
router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate(
            "followings followers"
        );
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Update
router.put("/", auth, upload.single("avatar"), async (req, res) => {
    try {
        const { username, bio, city, from, relationship } = req.body;
        let user = await User.findById(req.user.id);

        if (!user) {
            return res.status(400).json({ message: "user not found" });
        }
        if (req.file) {
            if (
                user.profilePicture != "noAvatar.png" ||
                user.profilePicture != ""
            ) {
                if (user.profilePicture != "") {
                    fs.unlink(
                        path.join(__dirname, "../", user.profilePicture),
                        () => {}
                    );
                }
            }

            user.profilePicture = `/${req.file.destination}${req.file.filename}`;
        }

        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.city = city || user.city;
        user.from = from || user.from;
        user.relationship = relationship || relationship;

        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Update
router.put("/coverPicture", auth, upload.single("cover"), async (req, res) => {
    try {
        let user = await User.findById(req.user.id);

        if (!user) {
            return res.status(400).json({ message: "user not found" });
        }

        if (req.file) {
            if (user.coverPicture != "") {
                fs.unlink(
                    path.join(__dirname, "../", user.coverPicture),
                    () => {}
                );
            }

            user.coverPicture = `/${req.file.destination}${req.file.filename}`;
        }

        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Get logged in user
router.get("/search", async (req, res) => {
    try {
        const search = req.query.search;
        const users = await User.find({
            $or: [
                { username: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ],
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Get a user
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate(
            "followings followers"
        );
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});

//follow a user
router.put("/:id/follow", auth, async (req, res) => {
    try {
        const authUser = await User.findById(req.user.id);
        const followedUser = await User.findById(req.params.id);
        const isFriend = authUser.followings.find((f) => f == req.params.id);
        if (isFriend) {
            const followingIndex = authUser.followings.findIndex(
                (f) => f == req.params.id
            );
            const followerIndex = followedUser.followers.findIndex(
                (f) => f == req.user.id
            );
            authUser.followings.splice(followingIndex, 1);
            followedUser.followers.splice(followerIndex, 1);
        } else {
            authUser.followings.push(req.params.id);
            followedUser.followers.push(req.user.id);
        }
        await authUser.save();
        await followedUser.save();
        res.status(200).json(authUser);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
