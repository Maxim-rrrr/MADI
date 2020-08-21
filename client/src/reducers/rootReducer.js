import { combineReducers } from 'redux';
import { customers } from './customers';
import { code } from './code'
import { editUser } from './editUser'
import { addUser } from './addUser'
import { login } from './login'
import { getId } from './getId'

const rootReducer = combineReducers({
    customers,
    code,
    editUser,
    addUser,
    login,
    getId
});

export default rootReducer;