import { combineReducers } from 'redux';

import { customers } from './customers';
import { code } from './code'
import { editUser } from './editUser'
import { addUser } from './addUser'
import { login } from './login'
import { getId } from './getId'

import { getTasks } from './getTasks'
import { addTask } from './addTask'
import { setTask } from './setTask'

import { addImg } from './addImg'

const rootReducer = combineReducers({
    customers,
    code,
    editUser,
    addUser,
    login,
    getId,
    getTasks,
    addTask,
    setTask,
    addImg
});

export default rootReducer;