import React, { Component } from 'react'
import { connect } from 'react-redux'

import { codeSend } from '../../actions/code'
import { addUser } from '../../actions/addUser'
import { getId } from '../../actions/getId'
import { login } from '../../actions/login'

import Popup from './models/Popup'

class Registration extends Component {
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
    event.preventDefault();
    await this.props.getId('/api/getId', {
      "email": this.state.emailValue
    })

    let sendCode = true
    // Проверим совпадают ли пароли
    if (this.state.passwordValue !== this.state.passwordRepeatValue) {
      this.setState({
        invalid: 'Pass error'
      });
      sendCode = false
    }

    // Проверим не заригистрирован ли такой Email уже
    let timer = setInterval(() => {
      if (this.props.getIdResponse) {
        if (this.props.getIdResponse.status === 200) {
          this.setState({
            invalid: 'email error'
          });
          sendCode = false
  
        } else if (this.props.getIdResponse.status === 400) {
          if (sendCode) {
            this.props.codeSend("/api/code", {
              email: this.state.emailValue
            });
      
            this.setState({
              code: true
            })
          }
          
        }
        clearInterval(timer)
      }
    })
  }

  // Отправка кода подтверждения
  async handleCodeSubmit(event) {
    if (this.state.codeValue == this.props.code.code) {

      let crypto = require("crypto");
      let sha256 = crypto.createHash("sha256");
      sha256.update(this.state.passwordValue, "utf8");  //utf8 here
      let pass = sha256.digest("base64");

      // Регистрация пользователя
      await this.props.addUser("/api/add-user", {
        email: this.state.emailValue,
        password: pass,
        inviting: this.state.invitingValue
      })

      let login = await setInterval(() => { 
        if (this.props.user) {
          const user = this.props.user
          localStorage.setItem(       'id', user._id      );
          localStorage.setItem(    'token', user.token    );
          localStorage.setItem(    'email', user.email    );
          localStorage.setItem(  'balance', user.balance  );
          localStorage.setItem(   'orders', user.orders   );
          localStorage.setItem( 'inviting', user.inviting );
      
          this.props.closeAllPopup();
          this.props.loginUpdata(true);
            
          clearInterval(login)
        }
      })
      
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
    } else if (this.state.invalid === 'email error') {
      error = 'Данный Email уже зарегистрирован'
    } else if (this.state.invalid === 'false code') {
      error = 'Неверный код подтверждения'
    } else if (this.state.invalid === 'inviting error') {
      error = 'Несуществующий аккаунт пригласителя'
    }

    let massageCode = ' Мы отправили на вашу почту код подтверждения '

    let form = 
      <form onSubmit={ this.handleSubmit } className="popup__form">

        <input 
          value       = { this.state.emailValue } 
          onChange    = { this.handleEmailChange }  
          type        = "email" 
          className   = "input popup__form-email" 
          placeholder = "Email (На который будут приходить задания)" 
          required
        />
        <input 
          value       = { this.state.passwordValue } 
          onChange    = { this.handlePasswordChange } 
          type        = "password" 
          className   = "input popup__form-pass" 
          placeholder = "Пароль" 
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

        <div className="input-group allow">
          <input 
            type        = "checkbox" 
            className   = "input"
            id          = 'checkbox'
            required 
          />
          <label htmlFor="checkbox"> Согласие на обработку персональных данных </label>
        </div>

        <button className='btn popup__form-submit' type='submit'> ЗАРЕГИСТРИРОВАТЬСЯ </button>
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
        title = 'Регистрация' 
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
    user: state.addUser,
    getIdResponse: state.getId,
    loginResponse: state.login
  };
};

const mapDispatchToProps = dispatch => {
  return {
    codeSend: (url, email) => dispatch(codeSend(url, email)),
    addUser: (url, userData) => dispatch(addUser(url, userData)),
    getId: (url, data) => dispatch(getId(url, data)),
    login: (url, data) => dispatch(login(url, data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Registration);