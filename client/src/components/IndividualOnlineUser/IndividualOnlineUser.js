import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const IndividualOnlineUser = ({ myfollowing, onlUsers }) => {
    return (
        <Link
            to={`/profile/${myfollowing._id}`}
            style={{ textDecoration: "none", color: "black" }}
        >
            <div className="onlineUserWrapper">
                <div className="onlineUserImageAndStatus">
                    <img
                        className="onlineUserProfilePicture"
                        src={myfollowing.profilePicture}
                        alt=""
                    />
                    <span
                        className="dot"
                        style={{
                            backgroundColor: `${
                                onlUsers.includes(myfollowing._id)
                                    ? "green"
                                    : "white"
                            }`,
                        }}
                    ></span>
                </div>
                <div className="onlineUserName">{myfollowing.username}</div>
            </div>
        </Link>
    );
};

export default IndividualOnlineUser;
