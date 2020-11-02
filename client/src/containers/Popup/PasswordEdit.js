import React, { Component } from 'react'
import { connect } from 'react-redux'
import { codeSend } from '../../actions/code'
import { editUser } from '../../actions/editUser'
import { getId } from '../../actions/getId'
import { login } from '../../actions/login'

import Popup from './models/Popup'

class PasswordEditPopap extends Component {
  constructor(props) {
    super(props)
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

    this.props.getId('/api/getId', {
      "email": this.state.emailValue
    })
    
    event.preventDefault();
  }

  // Отправка кода подтверждения
  async handleCodeSubmit(event) {
    if (this.state.codeValue == this.props.code.code) {

      let crypto = require("crypto");
      let sha256 = crypto.createHash("sha256");
      sha256.update(this.state.passwordValue, "utf8");  //utf8 here
      let pass = sha256.digest("base64");

      this.props.editUser("/api/user-edit/" + this.props.getIdResponse.id, {
        password: pass
      });
  
      await this.props.login('/api/login', {
        email: this.state.emailValue,
        password: pass
      })

      let loginOut = setInterval(() => { 
        if (this.props.loginResponse) {
          const user = this.props.loginResponse.user
          localStorage.setItem(       'id', user._id      );
          localStorage.setItem(    'token', user.token    );
          localStorage.setItem(    'email', user.email    );
          localStorage.setItem( 'password', user.password );
          localStorage.setItem(  'balance', user.balance  );
          localStorage.setItem(   'orders', user.orders   );
          localStorage.setItem( 'inviting', user.inviting );
      
          this.props.closeAllPopap();
          this.props.loginUpdata(true);
            
          clearInterval(loginOut)
        }
      }, 100)
      
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

    let error = ''
    if (this.state.invalid === 'Pass error') {
      error = 'Пароли не совпадают'
    } else if (this.state.invalid === 'false code') {
      error = 'Неверный код подтверждения'
    }

    let massageCode = ' Мы отправили на вашу почту код подтверждения '

    let form = 
      <form onSubmit={ this.handleSubmit } className="popup__form">

        <input 
          value       = { this.state.emailValue } 
          onChange    = { this.handleEmailChange }  
          type        = "email" 
          className   = "input popup__form-email" 
          placeholder = "Email" 
          required
        />
        <input 
          value       = { this.state.passwordValue } 
          onChange    = { this.handlePasswordChange } 
          type        = "password" 
          className   = "input popup__form-pass" 
          placeholder = "Новый пароль" 
          minLength   = "4" 
          required
        />
        <input 
          value       = { this.state.passwordRepeatValue } 
          onChange    = { this.handlePasswordRepeatChange } 
          type        = "password" 
          className   = "input popup__form-pass" 
          placeholder = "Повторите пароль" 
          minLength   = "4" 
          required 
        />

        <button className='btn popup__form-submit' type='submit'> ПОДТВЕРДИТЬ </button>
      </form>

      if (this.state.code) {
        form = 
        <>
          <div className="popup__back-box" onClick={() => { this.setState({ code: false }) }}>
            <span className='popup__back'></span>
          </div>
          
          <form onSubmit={ this.handleCodeSubmit } className="popup__form code-form animated fadeIn">
            <div className="code-label"> { massageCode } </div>
            <input 
              value       = { this.state.codeValue } 
              onChange    = { this.handleCodeChange }  
              type        = "text" 
              className   = "input popup__form-email" 
              placeholder = "Код подверждения" 
              required
            />

            <button className='btn popup__form-submit' type='submit'> ПОДТВЕРДИТЬ </button>
          </form>
        </>
      }

    return (
      <Popup 
        active = { this.props.active }
        title = 'Востановление пароля' 
        close = { this.props.closeAllPopup }
        error = { error }
      >

        { form }

      </Popup>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    code: state.code,
    user: state.user,
    getIdResponse: state.getId,
    loginResponse: state.login,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    codeSend: (url, email) => dispatch(codeSend(url, email)),
    editUser: (url, data) => dispatch(editUser(url, data)),
    getId: (url, data) => dispatch(getId(url, data)),
    login: (url, data) => dispatch(login(url, data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PasswordEditPopap);