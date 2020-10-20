import { combineReducers } from 'redux';

import { customers } from './customers';
import { code } from './code'
import { editUser } from './editUser'
import { addUser } from './addUser'
import { login } from './login'
import { getId } from './getId'
import { getCustomer } from './getCustomer'

import { getTasks } from './getTasks'
import { addTask } from './addTask'
import { setTask } from './setTask'

import { addImg } from './addImg'

import { createPayment } from './createPayment'
import { paymentFullBalance } from './paymentFullBalance'

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
    addImg,
    createPayment,
    getCustomer,
    paymentFullBalance
});

export default rootReducer;