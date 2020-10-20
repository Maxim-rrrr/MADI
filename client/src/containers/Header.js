import React, { Component } from 'react'
import LoginPopap from './LoginPopap'
import RegistrationPopap from './RegistrationPopap'
import LoginEditPopap from './LoginEditPopap'
import PasswordEditPopap from './PasswordEditPopap'
import Account from './Account'
import AddBalancePopap from './AddBalancePopap'

export default class Header extends Component {
  
  render() {
    let loginBlock = <></>

    if (this.props.logIn) {
      loginBlock = 
      <>
        <Account 
          loginUpdata = { (bool) => { this.props.loginUpdata(bool) } } 
          activeLoginEditPopap = { () => { this.props.activeLoginEditPopap() } }
          activeAddBalancePopap = { () => { this.props.activeAddBalancePopap() } } 
          logInClass = ' account--logIn'
        />
        <button className="btn btn-login btn-login--logIn" onClick = { () => { this.props.activeLoginPopap() } }> Войти </button>
      </>
    } else {
      loginBlock = 
      <>
        <Account 
          loginUpdata = { (bool) => { this.props.loginUpdata(bool) } } 
          activeLoginEditPopap = { () => { this.props.activeLoginEditPopap() } }
          activeAddBalancePopap = { () => { this.props.activeAddBalancePopap() } } 
          logInClass = ''
        />
        <button className="btn btn-login" onClick = { () => { this.props.activeLoginPopap() } }> Войти </button>
      </>
    }

    return (
      <header className="header">

        <LoginPopap 
          onClick = { (event) => {this.props.closePopap(event)} } 
          active  = { this.props.loginPopap }
          toRegistration = { () => {this.props.activeRegistrationPopap()} }
          toPassEdit = { () => {this.props.activePasswordEditPopap()} }
          closeLoginPopap = { this.props.closeLoginPopap }
          loginUpdata = { (bool) => { this.props.loginUpdata(bool) } }
        />

        <RegistrationPopap 
          onClick = { (event) => {this.props.closePopap(event)} } 
          active  = { this.props.registrationPopap }
          closeAllPopap = { () => {this.props.closeAllPopap()} }
          loginUpdata = { (bool) => { this.props.loginUpdata(bool) } }
          customersUpdataDB = { () => { this.props.customersUpdataDB() } }
        />

        <LoginEditPopap 
          onClick = { (event) => {this.props.closePopap(event)} } 
          active  = { this.props.loginEditPopap }
          closeAllPopap = { () => {this.props.closeAllPopap()} }
          loginUpdata = { (bool) => { this.props.loginUpdata(bool) } }
          customersUpdataDB = { () => { this.props.customersUpdataDB() } }
        />

        <PasswordEditPopap 
          onClick = { (event) => {this.props.closePopap(event)} } 
          active  = { this.props.passwordEditPopap }
          closeAllPopap = { () => {this.props.closeAllPopap()} }
          loginUpdata = { (bool) => { this.props.loginUpdata(bool) } }
          customersUpdataDB = { () => { this.props.customersUpdataDB() } }
        />

        <AddBalancePopap 
          onClick = { (event) => {this.props.closePopap(event)} } 
          active  = { this.props.addBalancePopap }
          closeAllPopap = { () => {this.props.closeAllPopap()} }
          loginUpdata = { (bool) => { this.props.loginUpdata(bool) } }
          customersUpdataDB = { () => { this.props.customersUpdataDB() } }
        />

        <div className="container">
          <div className="header__content">

            <div className="header__logo" 
              onMouseOver = { this.hoverLogo } 
              onMouseOut  = { this.hoverLogo } 
            >
              <img src="./img/logo.png" alt="Logo"/>
              <h1 className='header__title'> РГР работы МАДИ </h1>
            </div>

            <div className='login-container'>
              { loginBlock }
            </div>

          </div>
        </div>
      </header>
    )
  }
}
