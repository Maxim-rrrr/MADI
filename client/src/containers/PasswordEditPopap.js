import React, { Component } from 'react'
import { connect } from "react-redux";
import { codeSend } from "../actions/code";
import { editUser } from "../actions/editUser";

class PasswordEditPopap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailValue: '',
      passwordValue: '',
      passwordRepeatValue: '',
      codeValue: '',

      invalid: false,
      code: false
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePasswordRepeatChange = this.handlePasswordRepeatChange.bind(this);
    this.handleCodeChange = this.handleCodeChange.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCodeSubmit = this.handleCodeSubmit.bind(this);
  }

  // Функции для обработки вводов в input`s форм
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

  handlePasswordRepeatChange(event) {
    this.setState({
      passwordRepeatValue: event.target.value
    });
  }

  handleCodeChange(event) {
    if (event.target.value.length < 7) {
      this.setState({
        codeValue: event.target.value
      });
    }
    
  }

  // Отправка формы с вводом email и паролем перед кодом подтверждения
  async handleSubmit(event) {

    let sendCode = true
    // Проверим совпадают ли пароли
    if (this.state.passwordValue !== this.state.passwordRepeatValue) {
      this.setState({
        invalid: 'Pass error'
      });
      sendCode = false
    }
    
    if (sendCode) {
      this.props.codeSend("/api/code", {
        email: this.state.emailValue
      });

      this.setState({
        code: true
      })
    }
    
    event.preventDefault();
  }

  // Отправка кода подтверждения
  async handleCodeSubmit(event) {
    if (this.state.codeValue == this.props.code.code) {

      let crypto = require("crypto");
      let sha256 = crypto.createHash("sha256");
      sha256.update(this.state.passwordValue, "utf8");  //utf8 here
      let pass = sha256.digest("base64");

      let idUser = ''
      this.props.customers.forEach(customer => {
        if (customer.email === this.state.emailValue) {
          idUser = customer._id
        }
      });

      this.props.editUser("/api/user-edit/" + idUser, {
        password: pass
      });

      localStorage.setItem('email', this.state.emailValue);

      this.props.closeAllPopap()

      this.props.customersUpdataDB()
      this.props.loginUpdata(true);

      this.setState({
        code: false
      })

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
      active = 'pass-edit--active'
    }

    let error = ''
    if (this.state.invalid === 'Pass error') {
      error = 'Пароли не совпадают'
    } else if (this.state.invalid === 'false code') {
      error = 'Неверный код подтверждения'
    }

    let massageCode = ' Мы отправили на вашу почту код подтверждения '

    let form = 
      <form onSubmit={ this.handleSubmit } className="pass-edit__form">

        <input 
          value       = { this.state.emailValue } 
          onChange    = { this.handleEmailChange }  
          type        = "email" 
          className   = "input pass-edit__form-email" 
          placeholder = "Email" 
          required
        />
        <input 
          value       = { this.state.passwordValue } 
          onChange    = { this.handlePasswordChange } 
          type        = "password" 
          className   = "input pass-edit__form-pass" 
          placeholder = "Новый пароль" 
          minLength   = "4" 
          required
        />
        <input 
          value       = { this.state.passwordRepeatValue } 
          onChange    = { this.handlePasswordRepeatChange } 
          type        = "password" 
          className   = "input pass-edit__form-pass-repeat" 
          placeholder = "Повторите пароль" 
          minLength   = "4" 
          required 
        />

        <button className='btn pass-edit__form-submit' type='submit'> ПОДТВЕРДИТЬ </button>
      </form>

      if (this.state.code) {
        form = 
        <>
          <div className="pass-edit__form-back-box" onClick={() => { this.setState({ code: false }) }}>
            <span className='pass-edit__form-back'></span>
          </div>
          
          <form onSubmit={ this.handleCodeSubmit } className="pass-edit__form code-form animated fadeIn">
            <div className="code-label"> { massageCode } </div>
            <input 
              value       = { this.state.codeValue } 
              onChange    = { this.handleCodeChange }  
              type        = "text" 
              className   = "input pass-edit__form-email" 
              placeholder = "Код подверждения" 
              required
            />

            <button className='btn pass-edit__form-submit' type='submit'> ПОДТВЕРДИТЬ </button>
          </form>
        </>
      }

    return (
      <div className={"pass-edit " + active} onClick = { (event) => (this.props.onClick(event)) }>
        <div className="pass-edit__window">
          <button className="pass-edit__close-btn">
            <img src="./img/close.png" alt="" className="pass-edit__close-img"/>
          </button>
          <div className="pass-edit__title"> ВОСТАНОВЛЕНИЕ ПАРОЛЯ </div>
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
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    codeSend: (url, email) => dispatch(codeSend(url, email)),
    editUser: (url, data) => dispatch(editUser(url, data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PasswordEditPopap);