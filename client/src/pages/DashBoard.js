import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userActions";
import { useEffect, useContext } from "react";
import Navbar from "../components/Navbar/Navbar";
import { socketContext } from "../context/socket";
import Cookies from "js-cookie";
import Post from "../components/Post/Post";
import axios from "axios";
import { useState } from "react";
import Share from "../components/share/Share";
import "./dashboard.css";
import OnlineUsers from "../components/OnlineUsers/OnlineUsers";

const DashBoard = ({ history }) => {
    const [posts, setPosts] = useState([]);
    const [myFollowings, setMyFollowings] = useState([]);
    const socket = useContext(socketContext);
    const { user } = useSelector((state) => state.userLogin);

    console.log("rerender");

    useEffect(() => {
        if (!user) {
            history.push("/login");
        } else {
            socket.connect();
            socket.emit("hello", { userId: user._id, in: "home" });
        }
    }, [user, history, socket]);

    useEffect(() => {
        if (user) {
            axios
                .get(`/api/users/${user._id}`)
                .then((res) => setMyFollowings(res.data.followings));
        }
    }, [user]);

    useEffect(() => {
        socket.on("createPosts", (message) => {
            if (user != null)
                socket.emit("hello", { userId: user._id, in: "home" });
        });

        socket.on("posts", (posts) => {
            console.log("posts receive");
            setPosts(posts);
        });
    }, [socket]);

    return (
        <>
            <Navbar />
            <div className="dashboardWrapper">
                <div className="dashboardRightbar"></div>
                <div className="dashboardPostsAndShare">
                    {user && <Share user={user} socket={socket} />}
                    {posts.map((p) => (
                        <Post p={p} key={p._id} setPosts={setPosts} />
                    ))}
                </div>
                <div className="dashboardSideBar">
                    {user && (
                        <OnlineUsers user={user} myFollowings={myFollowings} />
                    )}
                </div>
            </div>
        </>
    );
};

export default DashBoard;
