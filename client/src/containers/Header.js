import React, { Component } from 'react'
import LoginPopap from './LoginPopap'
import RegistrationPopap from './RegistrationPopap'
import LoginEditPopap from './LoginEditPopap'
import PasswordEditPopap from './PasswordEditPopap'
import Account from './Account'

export default class Header extends Component {
  constructor(props) {
    super (props)
    this.state = {
      loginPopap: false,
      loginEditPopap: false,
      registrationPopap: false,
      passwordEditPopap: false
    } 

    this.activeLoginPopap = this.activeLoginPopap.bind(this)
    this.activeRegistrationPopap = this.activeRegistrationPopap.bind(this)
    this.activePasswordEditPopap = this.activePasswordEditPopap.bind(this)

    this.closePopap = this.closePopap.bind(this)

    this.closeLoginPopap = this.closeLoginPopap.bind(this)
    this.closeAllPopap = this.closeAllPopap.bind(this)
  }

  activeLoginPopap() {
    this.setState({
      loginPopap: true
    })
  }

  activeRegistrationPopap() {
    this.setState({
      registrationPopap: true,
      loginPopap: false
    })
  }

  activePasswordEditPopap() {
    this.setState({
      passwordEditPopap: true,
      loginPopap: false
    })
  }

  activeLoginEditPopap() {
    this.setState({
      loginEditPopap: true
    })
  }

  closePopap(event) {
    if (event.target.className === 'login login--active'                || 
        event.target.className === 'login__close-btn'                   ||
        event.target.className === 'login__close-img'                   ||
        event.target.className === 'login-edit login-edit--active'      || 
        event.target.className === 'login-edit__close-btn'              ||
        event.target.className === 'login-edit__close-img'              ||
        event.target.className === 'pass-edit pass-edit--active'        || 
        event.target.className === 'pass-edit__close-btn'               ||
        event.target.className === 'pass-edit__close-img'               ||
        event.target.className === 'registration registration--active'  || 
        event.target.className === 'registration__close-btn'            ||
        event.target.className === 'registration__close-img'            ) {

      this.setState({
        loginPopap: false,
        registrationPopap: false,
        loginEditPopap: false,
        passwordEditPopap: false
      })
    }
  }

  closeLoginPopap() {
    this.setState({
      loginPopap: false
    })
  }

  closeAllPopap() {
    this.setState({
      loginPopap: false,
      loginEditPopap: false,
      registrationPopap: false,
      passwordEditPopap: false
    })
  }

  render() {
    let loginBlock = <></>

    if (this.props.logIn) {
      loginBlock = 
      <>
        <Account loginUpdata = { (bool) => { this.props.loginUpdata(bool) } } activeLoginEditPopap = { () => { this.activeLoginEditPopap() } } logInClass = ' account--logIn'/>
        <button className="btn btn-login btn-login--logIn" onClick = { this.activeLoginPopap }> Войти </button>
      </>
    } else {
      loginBlock = 
      <>
        <Account loginUpdata = { (bool) => { this.props.loginUpdata(bool) } } activeLoginEditPopap = { () => { this.activeLoginEditPopap() } } logInClass = ''/>
        <button className="btn btn-login" onClick = { this.activeLoginPopap }> Войти </button>
      </>
    }

    return (
      <header className="header">

        <LoginPopap 
          onClick = { this.closePopap } 
          active  = { this.state.loginPopap }
          toRegistration = { this.activeRegistrationPopap }
          toPassEdit = { this.activePasswordEditPopap }
          closeLoginPopap = { this.closeLoginPopap }
          loginUpdata = { (bool) => { this.props.loginUpdata(bool) } }
        />

        <RegistrationPopap 
          onClick = { this.closePopap } 
          active  = { this.state.registrationPopap }
          closeAllPopap = { this.closeAllPopap }
          loginUpdata = { (bool) => { this.props.loginUpdata(bool) } }
          customersUpdataDB = { () => { this.props.customersUpdataDB() } }
        />

        <LoginEditPopap 
          onClick = { this.closePopap } 
          active  = { this.state.loginEditPopap }
          closeAllPopap = { this.closeAllPopap }
          loginUpdata = { (bool) => { this.props.loginUpdata(bool) } }
          customersUpdataDB = { () => { this.props.customersUpdataDB() } }
        />

        <PasswordEditPopap 
          onClick = { this.closePopap } 
          active  = { this.state.passwordEditPopap }
          closeAllPopap = { this.closeAllPopap }
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
