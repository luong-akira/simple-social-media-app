import React, { useEffect, useState, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar/Navbar";
import "./chatpage.css";
import Message from "../components/Message/Message";
import Cookies from "js-cookie";
import axios from "axios";
import { socketContext } from "../context/socket";

function ChatPage({ match }) {
    const socket = useContext(socketContext);

    const [messages, setMessages] = useState([]);
    const inputMessage = useRef();
    const { user } = useSelector((state) => state.userLogin);

    useEffect(() => {
        if (user && user._id) {
            console.log(user._id);
            socket.emit("hello", { userId: user._id, in: "chat" });
        }
    }, [socket, match.params.id, user]);

    const dispatch = useDispatch();
    useEffect(() => {
        const config = {
            headers: {
                "x-auth-token": Cookies.get("token"),
            },
        };
        axios
            .get(`/api/message/${match.params.id}`, config)
            .then((res) => setMessages(res.data))
            .catch((error) => toast.error(error.response.data.msg));
    }, [match.params.id, dispatch]);

    socket.on("connect", () => {
        console.log("hello");
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": Cookies.get("token"),
                },
            };

            axios
                .post(
                    `/api/message/${match.params.id}`,
                    { message: inputMessage.current.value },
                    config
                )
                .then((response) => {
                    socket.emit("sendMessage", {
                        receiverId: match.params.id,
                        data: response.data,
                    });
                    setMessages((prev) => [...prev, response.data]);
                    inputMessage.current.value = "";
                });
        } catch (error) {}
    };
    useEffect(() => {
        socket.on("getMessage", (data) => {
            if (user && data.receiverId == user._id) {
                setMessages((prev) => [...prev, data.data]);
            }
        });
    }, [socket, user]);

    return (
        <>
            <Navbar />
            <ToastContainer />
            {user && user._id && match.params.id === user._id ? (
                <div>You cant chat with yourself</div>
            ) : (
                <>
                    <div className="container1" id="container">
                        {messages &&
                            messages.map((m) => (
                                <Message
                                    key={m._id}
                                    message={m}
                                    own={
                                        m.senderId._id === user._id
                                            ? true
                                            : false
                                    }
                                />
                            ))}
                    </div>
                    <form
                        className="messageInputAndButton"
                        onSubmit={handleSubmit}
                    >
                        <input
                            type="text"
                            className="messageInput"
                            name="inputMessage"
                            ref={inputMessage}
                        />
                        <button className="btn btn-primary" type="submit">
                            Send
                        </button>
                    </form>
                </>
            )}
        </>
    );
}

export default ChatPage;
