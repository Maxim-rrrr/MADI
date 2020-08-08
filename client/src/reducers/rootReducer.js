import { combineReducers } from 'redux';
import { customers } from './customers';
import { code } from './code.js'
import { addUser } from './addUser.js'

const rootReducer = combineReducers({
    customers,
    code,
    addUser
});

export default rootReducer;