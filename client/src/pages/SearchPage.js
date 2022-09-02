import React, { useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import axios from "axios";
import { useState } from "react";
import "./searchPage.css";
import { Link } from "react-router-dom";

const SearchPage = ({ match, location }) => {
    console.log(location.search.split("=")[1]);
    const [users, setUsers] = useState([]);
    const search = location.search.split("=")[1];
    useEffect(() => {
        axios
            .get(`/api/users/search?search=${search}`)
            .then((res) => setUsers(res.data));
    }, [search]);
    return (
        <div>
            <Navbar />
            {users &&
                users.map((user) => (
                    <div className="searchBox">
                        <div className="searchEmailAndEmail">
                            <img
                                className="searchProfilePicture"
                                src={user.profilePicture}
                                alt=""
                            />
                            <p style={{ wordBreak: "break-word" }}>
                                <i>{user.email}</i>
                            </p>
                        </div>
                        <div className="searchfollow">
                            <Link to={`/profile/${user._id}`}>
                                <button className="btn btn-dark">
                                    Profile
                                </button>
                            </Link>
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default SearchPage;
