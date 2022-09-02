import React, { useState, useRef, useEffect } from "react";
import Picker from "emoji-picker-react";
import Cookies from "js-cookie";
import "./share.css";
import axios from "axios";
import { useParams } from "react-router-dom";

const Share = ({ user, socket }) => {
    const [file, setFile] = useState();
    const [preview, setPreview] = useState();
    const shareInput = useRef();
    const [emojiIsClick, setEmojiIsClick] = useState(false);
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
    };

    useEffect(() => {
        if (!file) {
            setPreview(undefined);
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    const onSelectedFile = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            setFile(undefined);
            return;
        }
        setFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let shareBtn = document.getElementById("shareBtn");
        shareBtn.disabled = true;
        const config = {
            headers: {
                "x-auth-token": Cookies.get("token"),
            },
        };
        let formData = new FormData();
        formData.append("post_img", file);
        formData.append("post", shareInput.current.value);

        axios.post(`/api/post`, formData, config).then(() => {
            socket.emit("posts_created", "hello");
            shareInput.current.value = "";
            setFile(null);
            shareBtn.disabled = false;
        });
    };

    useEffect(() => {
        if (chosenEmoji) {
            shareInput.current.value = shareInput.current.value.concat(
                chosenEmoji.emoji
            );
        }
    }, [chosenEmoji]);

    return (
        <form className="shareWrapper">
            <div className="shareInput">
                <img
                    className="shareProfileImage"
                    src={user.profilePicture}
                    alt=""
                />
                <textarea
                    className="shareUserInput"
                    type="text"
                    placeholder={`What's on your mind, ${user.username}?`}
                    ref={shareInput}
                />
            </div>
            <div style={{ marginLeft: "40px" }}>
                <i
                    class="fas fa-arrow-down"
                    style={{ cursor: "pointer" }}
                    onClick={(e) => setEmojiIsClick(!emojiIsClick)}
                ></i>
                {emojiIsClick && <Picker onEmojiClick={onEmojiClick} />}
            </div>
            <hr />
            <div className="shareMediaFiles">
                <div className="sharePhotoOrVideo">
                    <label className="fas fa-photo-video fa-2x fa-cog">
                        <input
                            type="file"
                            style={{ display: "none" }}
                            onChange={onSelectedFile}
                            name="avatar"
                        />
                    </label>
                </div>
                <div className="shareButton">
                    <button
                        id="shareBtn"
                        type="submit"
                        className="btn btn-outline-dark"
                        onClick={handleSubmit}
                    >
                        Share
                    </button>
                </div>
            </div>

            {file && (
                <div className="sharePreviewBox">
                    <div
                        className="shareDeletePreviewImage"
                        onClick={(e) => setFile(undefined)}
                    >
                        <i className="far fa-times-circle"></i>
                    </div>
                    <img className="sharePreviewImage" src={preview} alt="" />
                </div>
            )}
        </form>
    );
};

export default Share;
