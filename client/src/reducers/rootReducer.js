import { combineReducers } from 'redux';
import { customers } from './customers';
import { code } from './code.js'
import { editUser } from './editUser.js'
import { addUser } from './addUser.js'

const rootReducer = combineReducers({
    customers,
    code,
    editUser,
    addUser
});

export default rootReducer;