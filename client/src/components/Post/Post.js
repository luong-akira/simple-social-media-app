import React, { useState, useRef, useEffect, useContext } from "react";
import Picker from "emoji-picker-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { format } from "timeago.js";
import "./post.css";
import { socketContext } from "../../context/socket";
import Cookies from "js-cookie";
import axios from "axios";

const Post = ({ p, setPosts }) => {
    const socket = useContext(socketContext);
    const [userInfo, setUserInfo] = useState({});
    const userLogin = useSelector((state) => state.userLogin);
    const { user } = userLogin;
    const [postsComments, setPostsComments] = useState(p.comments);
    const [postsLikes, setPostsLikes] = useState(p.likes);
    const [postsDislikes, setPostsDisLikes] = useState(p.dislikes);
    const comment = useRef();

    const [emojiIsClick, setEmojiIsClick] = useState(false);
    const [chosenEmoji, setChosenEmoji] = useState(null);

    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
    };

    const handleClick = (e) => {
        const commentSection = document.getElementById(
            `comment-section-${p._id}`
        );
        console.log("hello");
        if (commentSection.style.display === "none") {
            commentSection.style.display = "";
        } else {
            commentSection.style.display = "none";
        }
    };

    const handleDeleteButton = (e) => {
        const config = {
            headers: {
                "x-auth-token": Cookies.get("token"),
            },
        };
        axios.delete(`/api/post/${p._id}`, config).then((res) => {
            console.log(res);
            setPosts((prev) => prev.filter((post) => post._id != p._id));
        });
    };

    const handleLikeButton = () => {
        const likePost = async () => {
            const config = {
                headers: {
                    "x-auth-token": Cookies.get("token"),
                },
            };
            const { data } = await axios.put(
                `/api/post/${p._id}/like`,
                {},
                config
            );
            socket.emit("sendLike", data.likes, p._id);
        };
        likePost();
    };

    const handleDislikeButton = () => {
        const dislikePost = async () => {
            const config = {
                headers: {
                    "x-auth-token": Cookies.get("token"),
                },
            };
            const { data } = await axios.put(
                `/api/post/${p._id}/dislike`,
                {},
                config
            );
            socket.emit("sendDislike", data.dislikes, p._id);
        };
        dislikePost();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let sendCommentBtn = document.getElementById("sendCommentBtn");
        sendCommentBtn.disabled = true;
        const config = {
            headers: {
                "x-auth-token": Cookies.get("token"),
                "Content-Type": "application/json",
            },
        };
        axios
            .put(
                `/api/post/${p._id}`,
                { comment: comment.current.value },
                config
            )
            .then((res) => {
                console.log(res.data.comments);
                sendCommentBtn.disabled = false;
                socket.emit("sendComment", res.data.comments, p._id);
            })
            .catch((err) => console.log("post not found"));
        comment.current.value = "";
    };

    useEffect(() => {
        socket.on("getMessage", (comments, postId) => {
            if (p._id === postId) {
                setPostsComments(comments);
            }
        });
        socket.on("getLike", (likes, postId) => {
            if (p._id === postId) {
                setPostsLikes(likes);
            }
        });
        socket.on("getDislike", (dislikes, postId) => {
            if (p._id === postId) {
                setPostsDisLikes(dislikes);
            }
        });
    }, [socket, p]);

    useEffect(() => {
        if (chosenEmoji) {
            comment.current.value = comment.current.value.concat(
                chosenEmoji.emoji
            );
        }
    }, [chosenEmoji]);

    return (
        <div
            style={{
                border: "1px solid gray",
                borderRadius: "5px",
                margin: "8px 0",
                padding: "5px 5px",
                boxShadow:
                    "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        flex: "11",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <div style={{ marginRight: "2px" }}>
                        <img
                            src={p.user && p.user.profilePicture}
                            style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "cover",
                                borderRadius: "50%",
                            }}
                            alt=""
                        />
                    </div>
                    <div style={{}}>
                        <Link
                            to={`/profile/${p.user._id}`}
                            style={{ textDecoration: "none", color: "black" }}
                        >
                            <p className="my-0" style={{ fontWeight: "bold" }}>
                                {p.user.username}
                            </p>
                        </Link>
                        <p className="my-0" style={{ fontSize: "14px" }}>
                            {format(p.created_at)}
                        </p>
                    </div>
                </div>
                {user && user._id == p.user._id && (
                    <div
                        style={{
                            flex: "1",
                            cursor: "pointer",
                            textAlign: "center",
                        }}
                        onClick={handleDeleteButton}
                    >
                        <i className="fas fa-times"></i>
                    </div>
                )}
            </div>
            <hr />
            <div style={{ wordBreak: "break-word" }}>
                <p>{p.post}</p>
                <img src={p && p.image} style={{ width: "100%" }} alt="" />
                {p.image && p.image.split(".")[1] === "mp4" && (
                    <video style={{ width: "100%" }} controls>
                        <source src={p && p.image} type="video/mp4" />
                    </video>
                )}
            </div>
            <hr />
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div
                    style={{ flex: "4.5", cursor: "pointer" }}
                    onClick={handleLikeButton}
                >
                    <i className="far fa-thumbs-up"></i> {postsLikes.length}{" "}
                    Likes
                </div>
                <div
                    style={{ flex: "4.5", cursor: "pointer" }}
                    onClick={handleDislikeButton}
                >
                    <i className="far fa-thumbs-down"></i>{" "}
                    {postsDislikes.length} Dislikes
                </div>
                <div
                    style={{
                        flex: "3",
                        cursor: "pointer",
                        textAlign: "center",
                    }}
                    onClick={handleClick}
                >
                    <i className="far fa-comments"></i> {postsComments.length}{" "}
                    Comments
                </div>
            </div>
            <hr />
            <div style={{ display: "none" }} id={`comment-section-${p._id}`}>
                {postsComments.map((comment) => (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            marginBottom: "20px",
                            wordBreak: "break-word",
                        }}
                        key={comment._id}
                    >
                        <div>
                            <img
                                src={comment.user.profilePicture}
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    objectFit: "cover",
                                    marginTop: "6px",
                                    borderRadius: "50%",
                                }}
                                className="mr-2"
                                alt=""
                            />
                        </div>
                        <div
                            className="pb-1 pl-1"
                            style={{
                                border: "1px solid gray",
                                width: "100%",
                                borderRadius: "5px",
                                backgroundColor: "rgb(240,242,245)",
                                position: "relative",
                            }}
                        >
                            <Link
                                to={`/profile/${comment.user._id}`}
                                style={{
                                    textDecoration: "none",
                                    color: "black",
                                }}
                            >
                                <p
                                    className="my-0"
                                    style={{ fontWeight: "bold" }}
                                >
                                    {comment.user.username}
                                </p>
                            </Link>
                            <p className="my-0">{comment.comment}</p>
                            <p
                                style={{
                                    fontSize: "12px",
                                    position: "absolute",
                                    left: "10px",
                                    bottom: "-18px",
                                }}
                            >
                                {format(comment.created_at)}
                            </p>
                        </div>
                    </div>
                ))}
                <form style={{ display: "flex", alignItems: "flex-start" }}>
                    <div>
                        <img
                            src={user && user.profilePicture}
                            style={{
                                width: "40px",
                                flex: "4",
                                height: "40px",
                                objectFit: "cover",
                                borderRadius: "50%",
                            }}
                            className="mr-2"
                            alt=""
                        />
                    </div>
                    <div style={{ flex: "7" }}>
                        <textarea
                            type="text"
                            style={{
                                width: "95%",
                                height: "40px",
                                borderRadius: "5px",
                            }}
                            id="textarea"
                            ref={comment}
                        />
                        <i
                            class="fas fa-arrow-down"
                            style={{ cursor: "pointer" }}
                            onClick={(e) => setEmojiIsClick(!emojiIsClick)}
                        ></i>
                        {emojiIsClick && <Picker onEmojiClick={onEmojiClick} />}
                    </div>
                    <div style={{ flex: "1" }}>
                        <button
                            id="sendCommentBtn"
                            className="btn btn-outline-dark"
                            type="submit"
                            onClick={handleSubmit}
                        >
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Post;
