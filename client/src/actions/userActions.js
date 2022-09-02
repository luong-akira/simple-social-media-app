import {
    USER_REGISTER_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT_SUCCESS,
    USER_LOGOUT_FAIL,
} from "../constants/userConstants";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

//Load user
export const loadUser = (cookie) => async (dispatch) => {
    try {
        const config = {
            headers: {
                "x-auth-token": cookie,
            },
        };
        const { data } = await axios.get(`/api/users`, config);
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error,
        });
    }
};

//Register
export const register = (formData) => async (dispatch) => {
    try {
        dispatch({ type: USER_REGISTER_REQUEST });

        const { data } = await axios.post(`/api/users/register`, formData);
        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error,
        });
    }
};

//Login
export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_LOGIN_REQUEST });
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        const { data } = await axios.post(
            `/api/users/login`,
            { email, password },
            config
        );
        Cookies.set("token", data.token);
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error,
        });
        toast.error("Invalid Credentials");
    }
};

//Logout
export const logout = () => async (dispatch) => {
    try {
        Cookies.set("token", "");
        dispatch({ type: USER_LOGOUT_SUCCESS });
    } catch (error) {
        dispatch({ type: USER_LOGOUT_FAIL });
    }
};
