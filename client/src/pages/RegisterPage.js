import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../actions/userActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const RegisterPage = ({ history }) => {
    const [file, setFile] = useState();
    const [preview, setPreview] = useState();
    const dispatch = useDispatch();
    const userLogin = useSelector((state) => state.userLogin);
    const { user } = userLogin;
    const username = useRef();
    const email = useRef();
    const password = useRef();
    const confirmPassword = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.current.value !== confirmPassword.current.value) {
            toast.error("Password and Confirm Password dont match");
            return;
        }
        let formData = new FormData();

        if (!username.current.value || username.current.value == "") {
            return toast("Please fill in username field");
        }

        if (!email.current.value || email.current.value == "") {
            return toast("Please fill in email field");
        }

        if (!password.current.value || password.current.value == "") {
            return toast("Please fill in password field");
        }

        formData.append("username", username.current.value);
        formData.append("email", email.current.value);
        formData.append("password", password.current.value);

        if (file) {
            formData.append("avatar", file);
        }
        await dispatch(register(formData));

        history.push("/login");
    };

    useEffect(() => {
        if (user) {
            history.push("/");
        }
    }, [user, history]);

    useEffect(() => {
        if (!file) {
            setPreview(undefined);
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    const onSelectFile = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            setFile(undefined);
            return;
        }
        setFile(e.target.files[0]);
    };

    return (
        <div className="container">
            <ToastContainer />
            <div
                className="row"
                style={{
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <div className="col-6">
                    <h1>Hello</h1>
                    <p>This is my social media</p>
                </div>
                <form className="col-6">
                    <div className="mb-2">
                        <label
                            htmlFor="exampleFormControlInput0"
                            className="form-label"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="exampleFormControlInput0"
                            placeholder="Username"
                            ref={username}
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label"
                        >
                            Email address
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="exampleFormControlInput1"
                            placeholder="Email"
                            ref={email}
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            htmlFor="exampleFormControlInput2"
                            className="form-label"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="exampleFormControlInput2"
                            placeholder="Password"
                            ref={password}
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            htmlFor="exampleFormControlInput3"
                            className="form-label"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="exampleFormControlInput3"
                            placeholder="Confirm Password"
                            ref={confirmPassword}
                        />
                    </div>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Upload</span>
                        </div>
                        <div className="custom-file">
                            <input
                                type="file"
                                className="custom-file-input"
                                id="inputGroupFile01"
                                name="avatar"
                                accept="image/png, image/gif, image/jpeg"
                                onChange={onSelectFile}
                            />
                            <label
                                className="custom-file-label"
                                for="inputGroupFile01"
                            >
                                Choose file
                            </label>
                        </div>
                    </div>
                    {file && (
                        <div style={{ position: "relative" }}>
                            <img
                                src={preview}
                                alt=""
                                style={{
                                    width: "30%",
                                    aspectRatio: "1/1",
                                    objectFit: "contain",
                                }}
                                className="mb-3"
                            />
                            <i
                                className="fa fa-times"
                                style={{
                                    position: "absolute",
                                    top: "0px",
                                    left: "30%",
                                    color: "red",
                                    cursor: "pointer",
                                }}
                                onClick={(e) => setFile(null)}
                            ></i>
                        </div>
                    )}
                    <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={handleSubmit}
                        style={{ width: "100%" }}
                    >
                        Register
                    </button>
                    <span>Already have an account?</span>
                    <Link to="/login" style={{ textDecoration: "none" }}>
                        {" "}
                        Login
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
