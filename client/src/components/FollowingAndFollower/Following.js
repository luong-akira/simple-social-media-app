import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import axios from "axios";

const Following = ({ following }) => {
    return (
        <>
            {following && (
                <a
                    href={`/profile/${following._id}`}
                    className="text-center"
                    style={{ textDecoration: "none" }}
                >
                    <img
                        className="profilePageFollowing"
                        src={following.profilePicture}
                        alt=""
                    />
                    <p>{following.username}</p>
                </a>
            )}
        </>
    );
};

export default Following;
