import React, { Component } from 'react';
import { connect } from "react-redux";

import { getCustomer } from '../actions/getCustomer'

import Header from './Header'
import Admin from './Admin';
import User from './User'


class App extends Component {
  constructor(props) {
    super (props)
    this.state = {
      requestCounter: 1,
      login: false,
      token: localStorage.getItem('token'),
      admin: false,

      loginPopup: false,
      loginEditPopup: false,
      registrationPopup: false,
      passwordEditPopup: false,
      addBalancePopup: false,

      user: {}
    } 

    this.activeLoginPopup = this.activeLoginPopup.bind(this)
    this.activeRegistrationPopup = this.activeRegistrationPopup.bind(this)
    this.activePasswordEditPopup = this.activePasswordEditPopup.bind(this)
    this.activeLoginEditPopup = this.activeLoginEditPopup.bind(this)
    this.activeAddBalancePopup = this.activeAddBalancePopup.bind(this)

    this.closeAllPopup = this.closeAllPopup.bind(this)
  }

  activeLoginPopup() {
    this.setState({
      loginPopup: true
    })
  }

  activeRegistrationPopup() {
    this.setState({
      registrationPopup: true,
      loginPopup: false
    })
  }

  activePasswordEditPopup() {
    this.setState({
      passwordEditPopup: true,
      loginPopup: false
    })
  }

  activeLoginEditPopup() {
    this.setState({
      loginEditPopup: true
    })
  }

  activeAddBalancePopup() {
    this.setState({
      addBalancePopup: true
    })
  }

  closeAllPopup() {
    this.setState({
      loginPopup: false,
      loginEditPopup: false,
      registrationPopup: false,
      passwordEditPopup: false,
      addBalancePopup: false
    })
  }

  componentDidMount() {

    if (this.state.token !== null && this.state.token !== '0') {
      this.setState({
        login: true
      })
    }

    if (localStorage.getItem('email') === 'admin@admin') {
      this.setState({
        admin: true
      })
    }
    
    this.userUpdata()

    globalGradient('body', [45, 44, 83], [81, 90, 209])

    document.addEventListener('scroll', () => {
      globalGradient('body', [45, 44, 83], [81, 90, 209])
    })

    function globalGradient(selector = '.grad', colorStart = [0, 0, 0], colorEnd = [255, 255, 255]) {
      let items = document.querySelectorAll(selector)
      items.forEach(item => {
        let colorDelta = []
      
        for (let i = 0; i < 3; i++) {
          colorDelta.push(colorEnd[i] - colorStart[i])
        }
      
        let height = document.documentElement.clientHeight
        let colorCoefficient = [
          colorDelta[0] / height,
          colorDelta[1] / height,
          colorDelta[2] / height,
        ]
      
        let clientTop = document.documentElement.scrollTop
      
        let heightStart = item.offsetTop - clientTop
        let heightEnd = heightStart + item.offsetHeight
      
        let gradStart = [
          colorStart[0] + colorCoefficient[0] * heightStart,
          colorStart[1] + colorCoefficient[1] * heightStart,
          colorStart[2] + colorCoefficient[2] * heightStart,
        ]
      
        let gradEnd = [
          colorStart[0] + colorCoefficient[0] * heightEnd,
          colorStart[1] + colorCoefficient[1] * heightEnd,
          colorStart[2] + colorCoefficient[2] * heightEnd,
        ]
      
        item.style.background = `linear-gradient(to bottom, rgb(${gradStart[0]}, ${gradStart[1]}, ${gradStart[2]}), rgb(${gradEnd[0]}, ${gradEnd[1]}, ${gradEnd[2]}))`
      })
    }
  }

  loginUpdata(bool) {
    this.setState({
      login: bool,
      token: localStorage.getItem('token')
    })
  }

  userUpdata() {
    if (localStorage.getItem('token')) {
      this.props.getCustomer('/api/getCustomer', {
        token: localStorage.getItem('token'),
        counter: this.state.requestCounter
      })
  
      let user_valid = setInterval(() => {
        if (this.props.getCustomerResponse !== '' && this.props.getCustomerResponse.status === 200 && this.props.getCustomerResponse.counter == this.state.requestCounter) {
          clearInterval(user_valid)
  
          let user = this.props.getCustomerResponse.customer
          localStorage.setItem(       'id', user._id      );
          localStorage.setItem(    'token', user.token    );
          localStorage.setItem(    'email', user.email    );
          localStorage.setItem( 'password', user.password );
          localStorage.setItem(  'balance', user.balance  );
          localStorage.setItem(   'orders', user.orders   );
          localStorage.setItem( 'inviting', user.inviting );
  
          this.setState({user})
          this.setState({requestCounter: this.state.requestCounter + 1})
        }
      })
    }
  }

  render() {
    let content = 
      <User 
        activeLoginPopup = { this.activeLoginPopup }
        userUpdata = {() => {this.userUpdata()}}
        activeAddBalancePopup   = { this.activeAddBalancePopup   }
      />
    if (this.state.admin) {
      content = <Admin />
    }
    
    return (
      <>
        <Header 
          customers = { this.props.customers } 
          logIn = { this.state.login }
          loginUpdata = { (bool) => { this.loginUpdata(bool) } }
          customersUpdataDB = { () => { this.customersUpdataDB() } }

          loginPopup        = { this.state.loginPopup        }
          loginEditPopup    = { this.state.loginEditPopup    }
          registrationPopup = { this.state.registrationPopup }
          passwordEditPopup = { this.state.passwordEditPopup }
          addBalancePopup   = { this.state.addBalancePopup   }

          activeLoginPopup        = { this.activeLoginPopup        }
          activeRegistrationPopup = { this.activeRegistrationPopup }
          activePasswordEditPopup = { this.activePasswordEditPopup }
          activeLoginEditPopup    = { this.activeLoginEditPopup    }
          activeAddBalancePopup   = { this.activeAddBalancePopup   }
          closePopup              = { this.closePopup              }
          closeAllPopup           = { this.closeAllPopup           }
      />

        { content }
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    getCustomerResponse: state.getCustomer,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCustomer: (url, data) => dispatch(getCustomer(url, data)),
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(App);
