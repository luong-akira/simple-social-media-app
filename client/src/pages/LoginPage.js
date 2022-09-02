import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../actions/userActions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

const LoginPage = ({ history }) => {
    const dispatch = useDispatch();
    const userLogin = useSelector((state) => state.userLogin);
    const { error, user } = userLogin;

    const email = useRef();
    const password = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login(email.current.value, password.current.value));
    };
    useEffect(() => {
        if (user) {
            history.push("/");
        }
    }, [error, user, history]);
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

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: "100%" }}
                        onClick={handleSubmit}
                    >
                        Login
                    </button>
                    <span>Dont have an account?</span>
                    <Link to="/register" style={{ textDecoration: "none" }}>
                        {" "}
                        Register
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
