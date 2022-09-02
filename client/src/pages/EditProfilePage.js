import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar/Navbar";
import axios from "axios";

const EditProfilePage = ({ history }) => {
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [city, setCity] = useState("");
    const [from, setFrom] = useState("");
    const [relationship, setRelationship] = useState("");
    const [profilePicture, setProfilePicture] = useState();
    const [previewProfilePicture, setPreviewProfilePicture] = useState();

    const { user } = useSelector((state) => state.userLogin);

    useEffect(() => {
        if (user)
            axios.get(`/api/users/${user._id}`).then((res) => {
                setUsername(res.data.username);
                setBio(res.data.bio);
                setCity(res.data.city);
                setFrom(res.data.from);
                setRelationship(res.data.relationship);
            });
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const config = {
            headers: {
                "x-auth-token": Cookies.get("token"),
            },
        };

        let formData = new FormData();

        if (profilePicture) {
            formData.append("avatar", profilePicture);
        }

        formData.append("bio", bio);
        formData.append("city", city);
        formData.append("from", from);
        formData.append("relationship", relationship);

        try {
            const { data } = await axios.put(`/api/users`, formData, config);
            console.log(data);
            window.location.href = "/";
        } catch (error) {}
    };

    useEffect(() => {
        if (!profilePicture) {
            return setPreviewProfilePicture(undefined);
        }
        let objUrl = URL.createObjectURL(profilePicture);
        setPreviewProfilePicture(objUrl);

        return () => URL.revokeObjectURL(objUrl);
    }, [profilePicture]);

    return (
        <>
            <Navbar />
            <div className="dashboardWrapper">
                <div className="dashboardRightbar"></div>
                <form
                    className="dashboardPostsAndShare"
                    style={{
                        border: "2px solid gray",
                        borderRadius: "10px",
                        padding: "10px",
                    }}
                >
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="bio">Bio</label>
                        <input
                            type="text"
                            className="form-control"
                            id="bio"
                            name="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input
                            type="text"
                            className="form-control"
                            id="city"
                            name="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="from">From</label>
                        <input
                            type="text"
                            className="form-control"
                            id="from"
                            name="from"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="relationship">Relationship</label>
                        <select
                            className="form-control"
                            id="relationship"
                            value={relationship}
                            onChange={(e) => {
                                setRelationship(e.target.value);
                            }}
                        >
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                            <option value="in a relationship">
                                In a relationship
                            </option>
                        </select>
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                Profile Picture
                            </span>
                        </div>
                        <div className="custom-file">
                            <input
                                type="file"
                                name="avatar"
                                className="custom-file-input"
                                id="inputGroupFile01"
                                accept="image/png, image/gif, image/jpeg"
                                onChange={(e) => {
                                    console.log(e.target.files[0]);
                                    setProfilePicture(e.target.files[0]);
                                }}
                            />
                            <label
                                className="custom-file-label"
                                htmlFor="inputGroupFile01"
                            >
                                Choose profile picture
                            </label>
                        </div>
                    </div>
                    {profilePicture && (
                        <div className="mb-2" style={{ position: "relative" }}>
                            <img
                                style={{
                                    width: "30%",
                                    aspectRatio: "1/1",
                                    objectFit: "contain",
                                }}
                                src={previewProfilePicture}
                                alt=""
                            />
                            <i
                                className="fas fa-times"
                                style={{
                                    position: "absolute",
                                    right: "3px",
                                    cursor: "pointer",
                                }}
                                onClick={(e) => setProfilePicture(null)}
                            ></i>
                        </div>
                    )}
                    <button
                        type="submit"
                        className="btn btn-dark"
                        onClick={handleSubmit}
                    >
                        Save
                    </button>
                </form>
                <div className="dashboardSideBar"></div>
            </div>
        </>
    );
};

export default EditProfilePage;
