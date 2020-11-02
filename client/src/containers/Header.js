import React, { Component } from 'react'
import Login from './Popup/Login'
import Registration from './Popup/Registration'
import LoginEdit from './Popup/LoginEdit'
import PasswordEdit from './Popup/PasswordEdit'
import Account from './Account'
import AddBalance from './Popup/AddBalance'

export default class Header extends Component {
  
  render() {
    let loginBlock = <></>

    if (this.props.logIn) {
      loginBlock = 
      <>
        <Account 
          loginUpdata = { (bool) => { this.props.loginUpdata(bool) } } 
          activeLoginEditPopup = { () => { this.props.activeLoginEditPopup() } }
          activeAddBalancePopup = { () => { this.props.activeAddBalancePopup() } } 
          logInClass = ' account--logIn'
        />
        <button className="btn btn-login btn-login--logIn" onClick = { () => { this.props.activeLoginPopup() } }> Войти </button>
      </>
    } else {
      loginBlock = 
      <>
        <Account 
          loginUpdata = { (bool) => { this.props.loginUpdata(bool) } } 
          activeLoginEditPopup = { () => { this.props.activeLoginEditPopup() } }
          activeAddBalancePopup = { () => { this.props.activeAddBalancePopup() } } 
          logInClass = ''
        />
        <button className="btn btn-login" onClick = { () => { this.props.activeLoginPopup() } }> Войти </button>
      </>
    }

    return (
      <header className="header">

        <Login
          closeAllPopup = { () => {this.props.closeAllPopup()} }
          active  = { this.props.loginPopup }
          toRegistration = { () => {this.props.activeRegistrationPopup()} }
          toPassEdit = { () => {this.props.activePasswordEditPopup()} }
          loginUpdata = { (bool) => { this.props.loginUpdata(bool) } }
        />

        <Registration 
          onClick = { (event) => {this.props.closePopup(event)} } 
          active  = { this.props.registrationPopup }
          closeAllPopup = { () => {this.props.closeAllPopup()} }
          loginUpdata = { (bool) => { this.props.loginUpdata(bool) } }
          customersUpdataDB = { () => { this.props.customersUpdataDB() } }
        />

        <LoginEdit 
          onClick = { (event) => {this.props.closePopup(event)} } 
          active  = { this.props.loginEditPopup }
          closeAllPopup = { () => {this.props.closeAllPopup()} }
          loginUpdata = { (bool) => { this.props.loginUpdata(bool) } }
          customersUpdataDB = { () => { this.props.customersUpdataDB() } }
        />

        <PasswordEdit
          onClick = { (event) => {this.props.closePopup(event)} } 
          active  = { this.props.passwordEditPopup }
          closeAllPopup = { () => {this.props.closeAllPopup()} }
          loginUpdata = { (bool) => { this.props.loginUpdata(bool) } }
          customersUpdataDB = { () => { this.props.customersUpdataDB() } }
        />

        <AddBalance
          active  = { this.props.addBalancePopup }
          closeAllPopup = { () => {this.props.closeAllPopup()} }
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
