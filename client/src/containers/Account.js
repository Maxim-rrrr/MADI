import React, { Component } from 'react'

export default class Account extends Component {
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
    
    let balance = <></>
    
    if (localStorage.getItem('balance') && localStorage.getItem('email') !== 'admin@admin') {
      balance = 
      <div className="account__balace-block" onClick = {() => { this.props.activeAddBalancePopap() }}>
        <button className="account__add-balance" /> 
        <span className="account__balace"> { localStorage.getItem('balance') } руб. </span>
      </div> 
    }
 

    

    return (
      <div className={'account' + this.props.logInClass}>
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
