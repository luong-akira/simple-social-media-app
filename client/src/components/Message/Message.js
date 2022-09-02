import React, { useEffect } from "react";
import { format } from "timeago.js";
import "./message.css";

const Message = ({ message, own }) => {
    console.log("re-render");
    useEffect(() => {
        let objDiv = document.getElementById("container");
        objDiv.scrollTop = objDiv.scrollHeight;
    }, []);
    return (
        <>
            {own === true ? (
                <div className="message-orange">
                    <p className="message-content">{message.message}</p>
                    <div className="message-timestamp-right">
                        {format(message.created_at)}
                    </div>
                    <img
                        className="mesage-orange-img"
                        src={message.senderId.profilePicture}
                        alt=""
                    />
                </div>
            ) : (
                <div className="message-blue">
                    <p className="message-content">{message.message}</p>
                    <div className="message-timestamp-left">
                        {format(message.created_at)}
                    </div>
                    <img
                        className="mesage-blue-img"
                        src={message.senderId.profilePicture}
                        alt=""
                    />
                </div>
            )}
        </>
    );
};

export default Message;
