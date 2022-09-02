import React, { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar/Navbar";
import Following from "../components/FollowingAndFollower/Following";
import Share from "../components/share/Share";
import Post from "../components/Post/Post";
import Follower from "../components/FollowingAndFollower/Follower";
import Cookies from "js-cookie";
import { socketContext } from "../context/socket";
import axios from "axios";
import "./profilepage.css";
import { Link } from "react-router-dom";
import EditCPModal from "./EditCPModal";

const ProfilePage = ({ history, match }) => {
    const [posts, setPosts] = useState([]);
    const [userInfo, setUserInfo] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const socket = useContext(socketContext);
    const [myFollowings, setMyFollowings] = useState([]);
    const [myFollowers, setMyFollowers] = useState([]);
    const [follow, setFollow] = useState();

    const { user } = useSelector((state) => state.userLogin);

    useEffect(() => {
        axios
            .get(`/api/users/${match.params.id}`)
            .then((res) => setUserInfo(res.data));
    }, [match]);

    useEffect(() => {
        if (user) {
            axios.get(`/api/users/${match.params.id}`).then((res) => {
                res.data.followers.forEach((follower) => {
                    if (follower._id == user._id) {
                        setFollow(true);
                    } else {
                        setFollow(false);
                    }
                });
            });
        }
    }, [user, match]);

    console.log("re render");

    useEffect(() => {
        if (!user) {
            history.push("/login");
        } else {
            if (user._id == match.params.id) {
                socket.connect();
                socket.emit("hello", { userId: user._id, in: "profile" });
            } else {
                socket.emit("hello", {
                    userId: match.params.id,
                    in: "profile",
                });
            }
        }
    }, [user, history, socket]);

    useEffect(() => {
        socket.on("createPosts", (message) => {
            if (user != null && user._id == match.params.id) {
                socket.emit("hello", { userId: user._id, in: "profile" });
            } else {
                socket.emit("hello", {
                    userId: match.params.id,
                    in: "profile",
                });
            }
        });

        socket.on("userposts", (posts) => {
            console.log("post recieved");
            setPosts(posts);
        });
    }, [socket]);

    const handleClick = (e) => {
        let followBtn = document.getElementById("followBtn");
        followBtn.disabled = true;
        const config = {
            headers: {
                "x-auth-token": Cookies.get("token"),
            },
        };
        axios
            .put(`/api/users/${match.params.id}/follow`, {}, config)
            .then((res) => {
                setFollow(!follow);
                followBtn.disabled = false;
            });
    };

    useEffect(() => {
        axios.get(`/api/users/${match.params.id}`).then((res) => {
            setMyFollowings(res.data.followings);
            setMyFollowers(res.data.followers);
        });
    }, [user, match]);

    return (
        <div>
            <Navbar />
            <div className="profilePageWrapper">
                <div className="profilePageRightbar"></div>
                <div className="profilePageMiddle">
                    <div className="profilePagePicture">
                        <img
                            className="profilePageCoverPicture"
                            src={userInfo.coverPicture && userInfo.coverPicture}
                            alt=""
                        />
                        {user && user._id == match.params.id && (
                            <i
                                class="fas fa-edit profilePageCoverPictureEditIcon"
                                onClick={(e) => setIsOpen(true)}
                            ></i>
                        )}
                    </div>
                    <div className="mt-1 mb-2 text-center">
                        <img
                            className="profilePageProfilePicture"
                            src={userInfo.profilePicture}
                            alt=""
                        />
                        <p>{userInfo.username}</p>
                        <p>
                            <i>{userInfo.bio}</i>
                        </p>
                        {user && user._id === match.params.id && (
                            <Link to="edit">
                                <button
                                    style={{
                                        border: "2px solid gray",
                                        borderRadius: "5px",
                                        backgroundColor: "#bfc4dc",
                                        cursor: "pointer",
                                    }}
                                >
                                    <i className="fas fa-edit"></i>Edit Profile
                                </button>
                            </Link>
                        )}
                    </div>
                    <div className="profilePagePostAndInfo">
                        <div className="profilePagePostAndShare">
                            {user && user._id === match.params.id && (
                                <Share user={user} socket={socket} />
                            )}
                            {posts.map((p) => (
                                <Post p={p} setPosts={setPosts} />
                            ))}
                        </div>
                        <div className="profilePageUserInfo">
                            {user && user._id !== match.params.id && (
                                <div>
                                    <Link to={`/message/${match.params.id}`}>
                                        <button className="btn btn-dark mr-5 my-2">
                                            <i class="fab fa-facebook-messenger"></i>{" "}
                                            Message
                                        </button>
                                    </Link>
                                    <button
                                        id="followBtn"
                                        className="btn btn-dark"
                                        onClick={handleClick}
                                    >
                                        {follow ? (
                                            <>
                                                <i class="fas fa-user-minus"></i>{" "}
                                                Unfollow
                                            </>
                                        ) : (
                                            <>
                                                <i class="fas fa-user-plus"></i>{" "}
                                                Follow
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                            <p>
                                <strong>User Information:</strong>
                            </p>
                            <p>
                                City: <i>{userInfo && userInfo.city}</i>
                            </p>
                            <p>
                                From: <i>{userInfo && userInfo.from}</i>
                            </p>
                            <p>
                                Relationship:{" "}
                                <i>{userInfo && userInfo.relationship}</i>
                            </p>
                            <p>
                                <strong>Followings:</strong>
                            </p>
                            <div className="profilePageFollowings">
                                {myFollowings.map((following) => (
                                    <Following following={following} />
                                ))}
                            </div>
                            <p>
                                <strong>Followers:</strong>
                            </p>
                            <div className="profilePageFollowings">
                                {myFollowers.map((follower) => (
                                    <Follower follower={follower} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isOpen && <EditCPModal setIsOpen={setIsOpen} />}
        </div>
    );
};

export default ProfilePage;
