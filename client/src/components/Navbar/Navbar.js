import React, { useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../actions/userActions";
import { withRouter } from "react-router-dom";
import { socketContext } from "../../context/socket";

function Navbar({ history }) {
    const socket = useContext(socketContext);
    const search = useRef();
    const dispatch = useDispatch();
    const userLogin = useSelector((state) => state.userLogin);
    const { user } = userLogin;

    const handleClick = () => {
        dispatch(logout());
        history.push("/login");
        socket.disconnect();
    };

    const submitHandler = async (e) => {
        try {
            e.preventDefault();

            history.push(`/search?q=${search.current.value}`);
            search.current.value = "";
        } catch (error) {}
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarTogglerDemo01"
                    aria-controls="navbarTogglerDemo01"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div
                    className="collapse navbar-collapse"
                    style={{ justifyContent: "space-between" }}
                    id="navbarTogglerDemo01"
                >
                    {" "}
                    <Link className="navbar-brand" to="/#">
                        <img
                            src="/social-media.png"
                            alt=""
                            style={{ width: "32px", height: "32px" }}
                        />
                    </Link>
                    <Link to={user && user._id && `/profile/${user._id}`}>
                        <img
                            src={user && user.profilePicture}
                            alt=""
                            style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                borderStyle: "double",
                                border: "2px solid white",
                                objectFit: "cover",
                            }}
                        />
                    </Link>
                    <form className="form-inline my-2 my-lg-0" method="GET">
                        <input
                            className="form-control mr-sm-2"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                            ref={search}
                        />
                        <button
                            onClick={submitHandler}
                            className="btn btn-outline-dark my-2 my-sm-0"
                            type="submit"
                        >
                            Search
                        </button>
                    </form>
                    <ul className="navbar-nav mr-0 mt-2 mt-lg-0">
                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to={user && user._id && `/profile/${user._id}`}
                            >
                                <i className="fas fa-address-card fa-2x"></i>{" "}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/#"
                                onClick={handleClick}
                            >
                                <i className="fas fa-sign-out-alt fa-2x"></i>
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default withRouter(Navbar);
