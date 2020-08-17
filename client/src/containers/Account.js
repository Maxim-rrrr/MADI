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
    let login = 
      <div className="account__login-block">
        <button className="account__edit" /> 
        <b className = 'account__login' onClick={() => { this.props.activeLoginEditPopap() }}> { localStorage.getItem('email') } </b> 
      </div> 

    if (localStorage.getItem('email') === 'admin@admin') {
      login = 
      <div className="account__login-block">
        <b className = 'account__login'> АДМИНИСТРАТОР </b> 
      </div> 
    }

    let customers = this.props.customers
    
    let balance = <></>
    customers.forEach(customer => {
      if (customer.email === localStorage.getItem('email') && localStorage.getItem('email') !== 'admin@admin') {
        balance = 
        <div className="account__balace-block">
          <button className="account__add-balance" /> 
          <span className="account__balace"> { customer.balance } руб. </span>
        </div> 
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
          
          { login }

          { balance }

        </div>
        <button className="account__exit" onClick={ () => (this.exit()) }>
          <img src="./img/exit.png" alt=""/>
        </button>
      </div>
    )
  }
}
