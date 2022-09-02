import React, { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar/Navbar";
import IndividualConversation from "../components/IndividualConversation/IndividualConversation";
import { socketContext } from "../context/socket";
import axios from "axios";

const ConversationPage = () => {
    const socket = useContext(socketContext);
    const [conversations, setConversations] = useState([]);
    const [onlUsers, setOnlUsers] = useState([]);

    const userLogin = useSelector((state) => state.userLogin);
    const { user } = userLogin;

    useEffect(() => {
        if (user) {
            socket.connect();
            socket.emit("hello", user._id);
        }
    }, [user, socket]);

    useEffect(() => {
        if (user) {
            socket.on("onlineUsers", (data) => {
                let onlineUserExceptMe = data
                    .map((e) => e.userId)
                    .filter((e) => e !== user._id);
                setOnlUsers(onlineUserExceptMe);
            });
        }
        return () => socket.close;
    }, [socket, user]);

    useEffect(() => {
        const config = {
            headers: {
                "x-auth-token": Cookies.get("token"),
            },
        };
        axios
            .get(`/api/message`, config)
            .then((res) => setConversations(res.data));
    }, []);
    return (
        <>
            <Navbar />
            <div className="dashboardWrapper">
                <div className="dashboardRightbar"></div>
                <div className="dashboardPostsAndShare">
                    {user &&
                        conversations.map((c) => (
                            <IndividualConversation
                                conversation={c}
                                userId={user._id}
                                onlUsers={onlUsers}
                            />
                        ))}
                </div>
                <div className="dashboardSideBar"></div>
            </div>
        </>
    );
};

export default ConversationPage;
