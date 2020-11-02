import React, { Component } from 'react'
import { connect } from 'react-redux'
import { codeSend } from '../../actions/code'
import { editUser } from '../../actions/editUser'
import { getId } from '../../actions/getId'

import Popup from './models/Popup'

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
    let truePass = localStorage.getItem('password')

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

    this.props.getId('/api/getId', {
      "email": this.state.emailValue
    })
    
    event.preventDefault();
  }

  async handleCodeSubmit(event) {
    if (this.state.codeValue == this.props.code.code) {
      
      
      this.props.editUser("/api/user-edit/" + this.props.getIdResponse.id, {
        email: this.state.emailValue
      });

      localStorage.setItem('email', this.state.emailValue);

      this.props.closeAllPopap()

      this.props.loginUpdata(true);

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
          <div className="popup__form-back-box" onClick={() => { this.setState({ code: false }) }}>
            <span className='popup__form-back'></span>
          </div>
          
          <form onSubmit={ this.handleCodeSubmit } className="popup__form code-form animated fadeIn">
            <div className="code-label"> Мы отправили на вашу почту код подтверждения </div>
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
        title = 'Изменение логина' 
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
    getIdResponse: state.getId,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    codeSend: (url, email) => dispatch(codeSend(url, email)),
    editUser: (url, data) => dispatch(editUser(url, data)),
    getId: (url, data) => dispatch(getId(url, data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginEditPopap);