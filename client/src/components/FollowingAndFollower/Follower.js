import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Follower = ({ follower }) => {
    return (
        <div>
            <>
                {follower && (
                    <a
                        href={`/profile/${follower._id}`}
                        className="text-center"
                        style={{ textDecoration: "none" }}
                    >
                        <img
                            className="profilePageFollowing"
                            src={follower.profilePicture}
                            alt=""
                        />
                        <p>{follower.username}</p>
                    </a>
                )}
            </>
        </div>
    );
};

export default Follower;
