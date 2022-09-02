import { combineReducers } from 'redux';
import { userRegister, userLogin } from './userReducers';

const rootReducer = combineReducers({
  userRegister,
  userLogin,
});

export default rootReducer;
