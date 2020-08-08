import React, { Component } from 'react'
import LoginPopap from './LoginPopap'
import RegistrationPopap from './RegistrationPopap'
import Account from './Account'

export default class Header extends Component {
  constructor(props) {
    super (props)
    this.state = {
      hoverLogo: false,
      loginPopap: false,
      registrationPopap: false
    } 

    this.hoverLogo = this.hoverLogo.bind(this)
    this.activeLoginPopap = this.activeLoginPopap.bind(this)
    this.activeRegistrationPopap = this.activeRegistrationPopap.bind(this)
    this.closePopap = this.closePopap.bind(this)

    this.closeLoginPopap = this.closeLoginPopap.bind(this)
    this.closeAllPopap = this.closeAllPopap.bind(this)
  }

  hoverLogo() {
    this.setState({
      hoverLogo: !this.state.hoverLogo
    })
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

  closePopap(event) {
    if (event.target.className === 'login login--active' || 
        event.target.className === 'login__close-btn'    ||
        event.target.className === 'login__close-img'    ||
        event.target.className === 'registration registration--active' || 
        event.target.className === 'registration__close-btn'    ||
        event.target.className === 'registration__close-img'    ) {

      this.setState({
        loginPopap: false,
        registrationPopap: false
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
      registrationPopap: false
    })
  }

  render() {
    let logoHoverClass = ''
    if (this.state.hoverLogo) {
      logoHoverClass = '--hover'
    }

    let loginBlock = <></>

    if (this.props.logIn) {
      loginBlock = 
      <>
        <Account customers = { this.props.customers } loginUpdata = { (bool) => { this.props.loginUpdata(bool) } } logInClass = ' account--logIn'/>
        <button className="btn btn-login btn-login--logIn" onClick = { this.activeLoginPopap }> Войти </button>
      </>
    } else {
      loginBlock = 
      <>
        <Account customers = { this.props.customers } loginUpdata = { (bool) => { this.props.loginUpdata(bool) } } logInClass = ''/>
        <button className="btn btn-login" onClick = { this.activeLoginPopap }> Войти </button>
      </>
    }

    return (
      <header className="header">

        <LoginPopap 
          onClick = { this.closePopap } 
          active  = { this.state.loginPopap }
          toRegistration = { this.activeRegistrationPopap }
          customers = { this.props.customers }
          closeLoginPopap = { this.closeLoginPopap }
          loginUpdata = { (bool) => { this.props.loginUpdata(bool) } }
        />

        <RegistrationPopap 
          onClick = { this.closePopap } 
          active  = { this.state.registrationPopap }
          customers = { this.props.customers }
          closeAllPopap = { this.closeAllPopap }
          loginUpdata = { (bool) => { this.props.loginUpdata(bool) } }
        />

        <div className="container">
          <div className="header__content">

            <div className="header__logo" 
              onMouseOver = { this.hoverLogo } 
              onMouseOut  = { this.hoverLogo } 
            >
              <img src="./img/logo.png" alt="Logo"/>
              <h1 className={'header__title' + logoHoverClass}> МАДИ </h1>
              <img src="./img/madi.png" alt="" className={'logo-madi' + logoHoverClass}/>
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
