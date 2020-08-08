import React, { Component } from 'react'

export default class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logInClass: null
    };
  }

  exit() {
    this.setState({
      logInClass: null
    })

    this.props.loginUpdata(false);
    setTimeout(() => {
      localStorage.clear()  
    }, 1000)
  }
  render() {
    let login = localStorage.getItem('email')
    let customers = this.props.customers

    let balance = 0
    customers.forEach(customer => {
      if (customer.email === login) {
        balance = customer.balance
      }
    });

    let logInClass = ''
    if (this.state.logInClass === null) {
      logInClass = this.props.logInClass
    } else {
      logInClass = this.state.logInClass
    }

    return (
      <div className={'account' + logInClass}>
        <div className="account__info">
          
          <div className="account__login-block">
            <button className="account__edit" /> 
            <b className = 'account__login' onClick={() => { this.props.activeLoginEditPopap() }}> { login } </b> 
          </div> 

          <div className="account__balace-block">
            <button className="account__add-balance" /> 
            <span className="account__balace"> { balance } руб. </span>
          </div> 

        </div>
        <button className="account__exit" onClick={ () => (this.exit()) }>
          <img src="./img/exit.png" alt=""/>
        </button>
      </div>
    )
  }
}
