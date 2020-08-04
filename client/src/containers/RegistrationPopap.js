import React, { Component } from 'react'

export default class RegistrationPopap extends Component {
  render() {
    let active = ''
    if (this.props.active) {
      active = 'registration--active'
    }
    return (
      <div className={"registration " + active} onClick = { (event) => (this.props.onClick(event)) }>
        <div className="registration__window">
          <button className="registration__close-btn">
            <img src="./img/close.png" alt="" className="registration__close-img"/>
          </button>
          <div className="registration__title"> РЕГИСТРАЦИЯ </div>

          <form action="" className="registration__form">

            <input type="email" className="input registration__form-email" placeholder="Email (На который будут приходить задания)" required/>
            <input type="password" className="input registration__form-pass" placeholder="Пароль" minLength="4" required/>
            <input type="password" className="input registration__form-pass-repiat" placeholder="Повторите пароль" minLength="6" required/>

            <button  className='btn registration__form-submit' type='submit'> Зарегистрироваться </button>
          </form>

        </div>      
      </div>
    )
  }
}
