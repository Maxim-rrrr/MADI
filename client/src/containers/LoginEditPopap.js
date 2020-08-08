import React, { Component } from 'react'
import { connect } from "react-redux";
import { codeSend } from "../actions/code";
import { loginEdit } from "../actions/loginEdit";

class LoginEditPopap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailValue: '',
      passwordValue: '',
      codeValue: '',

      invalid: false,
      code: false

    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleCodeChange = this.handleCodeChange.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCodeSubmit = this.handleCodeSubmit.bind(this);
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

  handleCodeChange(event) {
    if (event.target.value.length < 7) {
      this.setState({
        codeValue: event.target.value
      });
    }
    
  }

  handleSubmit(event) {
    let crypto = require("crypto");
    let sha256 = crypto.createHash("sha256");
    sha256.update(this.state.passwordValue, "utf8");  //utf8 here
    let pass = sha256.digest("base64");

    

    let sendCode = true
    // Проверим совпадают ли пароли
    let truePass = ''
    this.props.customers.forEach(customer => {
      if (customer.email === localStorage.getItem('email')) {
        truePass = customer.password
      }
    });

    if (pass !== truePass) {
      this.setState({
        invalid: 'Pass error'
      });
      sendCode = false
    }
    
    if (sendCode) {
      this.props.codeSend("/api/code", {
        email: this.state.emailValue
      });
      console.log(this.props);
      this.setState({
        code: true
      })
    }
    
    event.preventDefault();
  }

  async handleCodeSubmit(event) {
    if (this.state.codeValue == this.props.code.code) {
      let idUser = ''
      this.props.customers.forEach(customer => {
        if (customer.email === localStorage.getItem('email')) {
          idUser = customer._id
        }
      });
      console.log(idUser);
      this.props.codeSend("/api/user-edit/" + idUser, {
        email: this.state.emailValue
      });

      localStorage.setItem('email', this.state.emailValue);

      this.props.closeAllPopap()

      this.props.customersUpdataDB()

      this.props.loginUpdata(true);

    } else {
      this.setState({
        invalid: 'false code'
      });
    }
    event.preventDefault();
  }

  render() {
    let active = ''
    if (this.props.active) {
      active = 'login-edit--active'
    }

    let error = ''
    if (this.state.invalid === 'Pass error') {
      error = 'Пароли не совпадают'
    } else if (this.state.invalid === 'false code') {
      error = 'Неверный код подтверждения'
    }

    let form = 
      <form onSubmit={ this.handleSubmit } className="login-edit__form">

        <input 
          value={ this.state.emailValue } 
          onChange={ this.handleEmailChange } 
          type="email" 
          className="input login-edit__form-email" 
          placeholder="Новый Email" 
          required
        />
        
        <input 
          value={ this.state.passwordValue } 
          onChange={ this.handlePasswordChange } 
          type="password" 
          className="input login-edit__form-pass" 
          placeholder="Пароль" 
          required
        />
        
        <button className='btn login-edit__form-submit' type='submit'> Изменить </button>
      </form>

      if (this.state.code) {
        form = 
        <>
          <div className="registration__form-back-box" onClick={() => { this.setState({ code: false }) }}>
            <span className='registration__form-back'></span>
          </div>
          
          <form onSubmit={ this.handleCodeSubmit } className="registration__form code-form animated fadeIn">
            <div className="code-label"> Мы отправили на вашу почту код подтверждения </div>
            <input 
              value       = { this.state.codeValue } 
              onChange    = { this.handleCodeChange }  
              type        = "text" 
              className   = "input registration__form-email" 
              placeholder = "Код подверждения" 
              required
            />

            <button className='btn registration__form-submit' type='submit'> Подтвердить </button>
          </form>
        </>
      }

    return (
      <div className={"login-edit " + active} onClick = { (event) => (this.props.onClick(event)) }>
        <div className="login-edit__window">
          <button className="login-edit__close-btn">
            <img src="./img/close.png" alt="" className="login-edit__close-img"/>
          </button>

          <div className="login-edit__title"> ИЗМЕНЕНИЕ ЛОГИНА </div>
          <div className="invalid-label"> { error } </div>

          { form }

        </div>      
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    code: state.code,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    codeSend: (url, email) => dispatch(codeSend(url, email)),
    loginEdit: (url, data) => dispatch(loginEdit(url, data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginEditPopap);