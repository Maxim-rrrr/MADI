import React, { Component } from 'react'

import { connect } from 'react-redux'
import { loginAdmin } from "../../actions/login-admin";

class Auth extends Component {
  constructor(props) {
    super(props)

    this.state = {
      nameValue: '',
      passwordValue: '',
      error: false
    }

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleNameChange(event) {
    this.setState({
      nameValue: event.target.value
    });
  }

  handlePasswordChange(event) {
    this.setState({
      passwordValue: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault()

    function crypto(pass) {
      let crypto = require("crypto");
      let sha256 = crypto.createHash("sha256");
      sha256.update(pass, "utf8");  //utf8 here
      return sha256.digest("base64");
    }

    this.props.loginAdmin('/api/login-admin', { 
      name: this.state.nameValue,
      password: crypto(this.state.passwordValue)
    })

    setTimeout(() => {
      let timer = setInterval(() => {
        if ( this.props.loginResponse !== '' ) {

          if (this.props.loginResponse.status === 200) {
            localStorage.setItem('token-admin', this.props.loginResponse.token)
            window.location.reload()
          } else {
            this.setState({ 
              passwordValue: '',
              error: true
            })
            
            setTimeout(() => this.setState({ error: false }), 1000)
          }

          clearInterval(timer)
        } 

      })
    }, 500)
    
  }

  render() {
    return (
      <div className = 'admin-auth'>
        <form className = 'admin-auth__form' onSubmit = { this.handleSubmit }>
          <div className="admin-auth__title"> ВХОД </div>
          
          <input 
            value = { this.state.nameValue } 
            onChange = { this.handleNameChange } 
            type = 'text' 
            className = { this.state.error?'input admin-auth__input admin-auth__input--error':'input admin-auth__input' } 
            placeholder = 'Имя' 
            required
          />
          
          <input 
            value = { this.state.passwordValue } 
            onChange = { this.handlePasswordChange } 
            type = 'password' 
            className = { this.state.error?'input admin-auth__input admin-auth__input--error':'input admin-auth__input' } 
            placeholder = 'Пароль' 
            required
          />

          <button className = 'btn admin-auth__btn'> Войти </button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    loginResponse: state.loginAdmin,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loginAdmin: (url, data) => dispatch(loginAdmin(url, data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth)