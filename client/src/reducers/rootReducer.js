import { combineReducers } from 'redux';
import { customers } from './customers';
import { code } from './code.js'
import { addUser } from './addUser.js'
import { loginEdit } from './loginEdit.js'

const rootReducer = combineReducers({
    customers,
    code,
    addUser,
    loginEdit
});

export default rootReducer;