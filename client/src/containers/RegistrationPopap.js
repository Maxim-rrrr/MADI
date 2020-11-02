import React, { Component } from 'react'
import { connect } from 'react-redux'

import { codeSend } from '../actions/code'
import { addUser } from '../actions/addUser'
import { getId } from '../actions/getId'
import { login } from '../actions/login'

class RegistrationPopap extends Component {
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
    setTimeout(() => {
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
    }, 500)
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
        password: pass
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
      
          this.props.closeAllPopap();
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
    let active = ''
    if (this.props.active) {
      active = 'registration--active'
    }

    let error = ''
    if (this.state.invalid === 'Pass error') {
      error = 'Пароли не совпадают'
    } else if (this.state.invalid === 'email error') {
      error = 'Данный Email уже зарегистрирован'
    } else if (this.state.invalid === 'false code') {
      error = 'Неверный код подтверждения'
    }

    let massageCode = ' Мы отправили на вашу почту код подтверждения '

    let form = 
      <form onSubmit={ this.handleSubmit } className="registration__form">

        <input 
          value       = { this.state.emailValue } 
          onChange    = { this.handleEmailChange }  
          type        = "email" 
          className   = "input registration__form-email" 
          placeholder = "Email (На который будут приходить задания)" 
          required
        />
        <input 
          value       = { this.state.passwordValue } 
          onChange    = { this.handlePasswordChange } 
          type        = "password" 
          className   = "input registration__form-pass" 
          placeholder = "Пароль" 
          minLength   = "4" 
          required
        />
        <input 
          value       = { this.state.passwordRepeatValue } 
          onChange    = { this.handlePasswordRepeatChange } 
          type        = "password" 
          className   = "input registration__form-pass-repeat" 
          placeholder = "Повторите пароль" 
          minLength   = "4" 
          required 
        />

        <button className='btn registration__form-submit' type='submit'> ЗАРЕГИСТРИРОВАТЬСЯ </button>
      </form>

      if (this.state.code) {
        form = 
        <>
          <div className="registration__form-back-box" onClick={() => { this.setState({ code: false }) }}>
            <span className='registration__form-back'></span>
          </div>
          
          <form onSubmit={ this.handleCodeSubmit } className="registration__form code-form animated fadeIn">
            <div className="code-label"> { massageCode } </div>
            <input 
              value       = { this.state.codeValue } 
              onChange    = { this.handleCodeChange }  
              type        = "text" 
              className   = "input registration__form-email" 
              placeholder = "Код подверждения" 
              required
            />

            <button className='btn registration__form-submit' type='submit'> ПОДТВЕРДИТЬ </button>
          </form>
        </>
      }

    return (
      <div className={"registration " + active} onClick = { (event) => (this.props.onClick(event)) }>
        <div className="registration__window">
          <button className="registration__close-btn">
            <img src="./img/close.png" alt="" className="registration__close-img"/>
          </button>
          <div className="registration__title"> РЕГИСТРАЦИЯ </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationPopap);