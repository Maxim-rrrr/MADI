import React, { Component } from 'react'

export default class LoginPopap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailValue: '',
      passwordValue: '',
      invalid: false
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmailChange(event) {
    this.setState({
      emailValue: event.target.value
    });
  }

  handlePasswordChange(event) {
    this.setState({
      passwordValue: event.target.value
    });
  }

  handleSubmit(event) {
    let crypto = require("crypto");
    let sha256 = crypto.createHash("sha256");
    sha256.update(this.state.passwordValue, "utf8");  //utf8 here
    let pass = sha256.digest("base64");

    this.props.customers.forEach(customer => {
      if (customer.email === this.state.emailValue && customer.password === pass) {
        localStorage.setItem('email', customer.email);
        this.props.closeLoginPopap();
        this.props.loginUpdata(true);
      }
    });

    if (localStorage.getItem('email') === null) {
      this.setState({
        invalid: true
      });
    }
    
    event.preventDefault();
  }

  render() {
    let active = ''
    if (this.props.active) {
      active = 'login--active'
    }

    let error = ''
    if (this.state.invalid) {
      error = 'Неверный логин или пароль'
    }

    return (
      <div className={"login " + active} onClick = { (event) => (this.props.onClick(event)) }>
        <div className="login__window">
          <button className="login__close-btn">
            <img src="./img/close.png" alt="" className="login__close-img"/>
          </button>
          <div className="login__title"> ВХОД </div>
          <div className="invalid-label"> { error } </div>
          <form onSubmit={ this.handleSubmit } className="login__form">

            <input 
              value={ this.state.emailValue } 
              onChange={ this.handleEmailChange } 
              type="email" 
              className="input login__form-email" 
              placeholder="Email" 
              required
            />
            
            <input 
              value={ this.state.passwordValue } 
              onChange={ this.handlePasswordChange } 
              type="password" 
              className="input login__form-pass" 
              placeholder="Пароль" 
              required
            />
            
            <button className='btn login__form-submit' type='submit'> ВОЙТИ </button>
          </form>

          <button className="btn-registration" onClick = { () => (this.props.toRegistration()) }> Регистрация </button>
          <button className="btn-registration" onClick = { () => (this.props.toPassEdit()) }> Забыли пароль? </button>
        </div>      
      </div>
    )
  }
}
