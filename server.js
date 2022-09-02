require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const path = require("path");
const { Server } = require("socket.io");
const Post = require("./models/post");
const User = require("./models/user");

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

const connectDB = require("./config/db");

// Connect to MongoDB Atlas
connectDB();

// Use midlleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Serve static file
app.use("/public", express.static("public"));

// Use router
app.use("/api/users", require("./routes/user"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/message", require("./routes/message"));
app.use("/api/post", require("./routes/post"));
app.use("/api/notification", require("./routes/notifications"));

let users = [];

const addUser = (userId, socketId) => {
    const userFound = users.find((user) => user.userId === userId);
    if (userFound) {
        const userIndex = users.findIndex((user) => user.userId === userId);
        users.splice(userIndex, 1);
        users.push({ userId, socketId });
    } else {
        users.push({ userId, socketId });
    }
};

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};

const deleteUser = (socketId) => {
    const userIndex = users.findIndex((u) => u.socketId === socketId);
    users.splice(userIndex, 1);
};

async function getPosts(userId, location, socketId) {
    const user = await User.findById(userId);
    if (!user) {
        return;
    }
    let posts;
    if (location == "home") {
        const followings = user.followings;
        const followingsPlusAuthUser = [...followings, userId];

        posts = await Post.find({
            user: { $in: followingsPlusAuthUser },
        })
            .sort("-created_at")
            .populate("user comments.user");
        io.to(socketId).emit("posts", posts);
    } else {
        posts = await Post.find({
            user: userId,
        })
            .sort("-created_at")
            .populate("user comments.user");
        // console.log(posts);
        io.to(socketId).emit("userposts", posts);
    }
}

//Socket.io
io.on("connection", (socket) => {
    //console.log('A user has join the chat');

    socket.on("hello", (user) => {
        addUser(user.userId, socket.id);
        console.log(users);
        io.emit("onlineUsers", users);
        getPosts(user.userId, user.in, socket.id);
    });

    socket.on("posts_created", (message) => {
        io.emit("createPosts", "hello");
    });

    socket.on("isRead", (data) => {
        console.log(data);
    });

    socket.on("sendMessage", ({ receiverId, data }) => {
        console.log(receiverId);
        console.log(data);
        const receiver = getUser(receiverId);
        if (receiver) {
            io.to(receiver.socketId).emit("getMessage", {
                receiverId,
                data,
            });
        }
    });

    socket.on("isRead", (data) => {
        console.log(data);
    });

    socket.on("disconnect", function () {
        console.log("A user has been disconnected");
        deleteUser(socket.id);
        io.emit("onlineUsers", users);
    });

    socket.on("sendLike", (likes, postId) => {
        io.emit("getLike", likes, postId);
    });

    socket.on("sendDislike", (dislikes, postId) => {
        io.emit("getDislike", dislikes, postId);
    });

    socket.on("sendComment", (comments, postId) => {
        io.emit("getMessage", comments, postId);
    });
});

if (process.env.NODE_ENV == "production") {
    app.use(express.static(path.join(__dirname, "/client/build")));
    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    );
}

// Listen on PORT 5000
const port = process.env.PORT || 5000;
httpServer.listen(port, () =>
    console.log(`Server is running on port ${port}...`)
);
