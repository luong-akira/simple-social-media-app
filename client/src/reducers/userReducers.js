import {
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT_SUCCESS,
  USER_LOGOUT_FAIL,
} from '../constants/userConstants';

export const userRegister = (state = {}, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return { loading: true };
    case USER_REGISTER_SUCCESS:
      return { user: action.payload, loading: false };
    case USER_REGISTER_FAIL:
      return { error: action.payload, loading: false };
    default:
      return {};
  }
};

export const userLogin = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true };
    case USER_LOGOUT_FAIL:
    case USER_LOGIN_SUCCESS:
      return { user: action.payload, loading: false, success: true };
    case USER_LOGIN_FAIL:
      return { error: action.payload, loading: false, success: false };
    case USER_LOGOUT_SUCCESS:
    default:
      return {};
  }
};
