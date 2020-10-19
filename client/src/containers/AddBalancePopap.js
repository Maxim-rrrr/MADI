import React, { Component } from 'react'
import { connect } from 'react-redux'

import { createPayment } from '../actions/createPayment'

class AddBalancePopap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      summa: '',

      invalid: false,
      loadingPayment: false
    };

    this.handleSummaChange = this.handleSummaChange.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Функции для обработки вводов в input форм
  handleSummaChange(event) {
    this.setState({
      summa: event.target.value,
    });
  }


  handleSubmit(event) {
    event.preventDefault()
    this.setState({
      loadingPayment: true
    })


    this.props.createPayment('/api/createPayment', {
      prise: this.state.summa,
      info: {
        type: 2, // Пополнение баланса
        email: localStorage.getItem('email'),
        token: localStorage.getItem('token')
      }
    })

    let payment = setInterval(() => {
      if (this.props.createPaymentResponse) {
        clearInterval(payment)
        if (this.props.createPaymentResponse.confirmation) {
          window.location.href = this.props.createPaymentResponse.confirmation.confirmation_url;
        } 
        this.setState({
          loadingPayment: false,
        });
      }
    })

  }

  render() {
    let active = ''
    if (this.props.active) {
      active = 'registration--active'
    }


    let form = 
      <form onSubmit={ this.handleSubmit } className="registration__form">

        <input 
          value       = { this.state.summa } 
          onChange    = { this.handleSummaChange }  
          type        = "number" 
          className   = "input add-balance__input" 
          placeholder = "Сумма..." 
          required
        />
        
        {
          this.state.loadingPayment?
            <div className="loader add-balance__loader">
              <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>:
            <button className='btn registration__form-submit' type='submit'> Оплатить </button>
        }
      </form>


    return (
      <div className={"registration " + active} onClick = { (event) => (this.props.onClick(event)) }>
        <div className="registration__window">
          <button className="registration__close-btn">
            <img src="./img/close.png" alt="" className="registration__close-img"/>
          </button>
          <div className="registration__title"> Пополнение баланса </div>
          
          { form }

        </div>      
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    createPaymentResponse: state.createPayment,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createPayment: (url, data) => dispatch(createPayment(url, data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddBalancePopap);