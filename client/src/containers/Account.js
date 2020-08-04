import React, { Component } from 'react'

export default class Account extends Component {
  render() {
    let login = localStorage.getItem('email')
    let customers = this.props.customers

    let balance = 0
    customers.forEach(customer => {
      if (customer.email === login) {
        balance = customer.balance
      }
    });

    return (
      <div className='account'>
        <div className="account__info">
          
          <div className="account__login-block">
            <button className="account__edit" /> 
            <b className = 'account__login'> { login } </b> 
          </div> 

          <div className="account__balace-block">
            <button className="account__add-balance" /> 
            <span className="account__balace"> { balance } руб. </span>
          </div> 

        </div>
        <button className="account__exit">
          <img src="./img/exit.png" alt=""/>
        </button>
      </div>
    )
  }
}
