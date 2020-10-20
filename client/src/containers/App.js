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

      loginPopap: false,
      loginEditPopap: false,
      registrationPopap: false,
      passwordEditPopap: false,
      addBalancePopap: false,

      user: {}
    } 

    this.activeLoginPopap = this.activeLoginPopap.bind(this)
    this.activeRegistrationPopap = this.activeRegistrationPopap.bind(this)
    this.activePasswordEditPopap = this.activePasswordEditPopap.bind(this)
    this.activeLoginEditPopap = this.activeLoginEditPopap.bind(this)
    this.activeAddBalancePopap = this.activeAddBalancePopap.bind(this)

    this.closePopap = this.closePopap.bind(this)

    this.closeLoginPopap = this.closeLoginPopap.bind(this)
    this.closeAllPopap = this.closeAllPopap.bind(this)
  }

  activeLoginPopap() {
    this.setState({
      loginPopap: true
    })
  }

  activeRegistrationPopap() {
    this.setState({
      registrationPopap: true,
      loginPopap: false
    })
  }

  activePasswordEditPopap() {
    this.setState({
      passwordEditPopap: true,
      loginPopap: false
    })
  }

  activeLoginEditPopap() {
    this.setState({
      loginEditPopap: true
    })
  }

  activeAddBalancePopap() {
    this.setState({
      addBalancePopap: true
    })
  }

  closePopap(event) {
    if (event.target.className === 'login login--active'                || 
        event.target.className === 'login__close-btn'                   ||
        event.target.className === 'login__close-img'                   ||
        event.target.className === 'login-edit login-edit--active'      || 
        event.target.className === 'login-edit__close-btn'              ||
        event.target.className === 'login-edit__close-img'              ||
        event.target.className === 'pass-edit pass-edit--active'        || 
        event.target.className === 'pass-edit__close-btn'               ||
        event.target.className === 'pass-edit__close-img'               ||
        event.target.className === 'registration registration--active'  || 
        event.target.className === 'registration__close-btn'            ||
        event.target.className === 'registration__close-img'            ) {

      this.setState({
        loginPopap: false,
        registrationPopap: false,
        loginEditPopap: false,
        passwordEditPopap: false,
        addBalancePopap: false
      })
    }
  }

  closeLoginPopap() {
    this.setState({
      loginPopap: false
    })
  }

  closeAllPopap() {
    this.setState({
      loginPopap: false,
      loginEditPopap: false,
      registrationPopap: false,
      passwordEditPopap: false,
      addBalancePopap: false
    })
  }

  componentDidMount() {

    if (this.state.token !== null && this.state.token !== '0') {
      this.setState({
        login: true
      })
    }

    if (this.state.token === 'apksLWiOCMXtp8VVOfOIahLzUWhyo94i23QgwbPJHhs=') {
      this.setState({
        admin: true
      })
    }
    
    this.userUpdata()
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
        activeLoginPopap = { this.activeLoginPopap }
        userUpdata = {() => {this.userUpdata()}}
        activeAddBalancePopap   = { this.activeAddBalancePopap   }
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

          loginPopap        = { this.state.loginPopap        }
          loginEditPopap    = { this.state.loginEditPopap    }
          registrationPopap = { this.state.registrationPopap }
          passwordEditPopap = { this.state.passwordEditPopap }
          addBalancePopap   = { this.state.addBalancePopap   }

          activeLoginPopap        = { this.activeLoginPopap        }
          activeRegistrationPopap = { this.activeRegistrationPopap }
          activePasswordEditPopap = { this.activePasswordEditPopap }
          activeLoginEditPopap    = { this.activeLoginEditPopap    }
          activeAddBalancePopap   = { this.activeAddBalancePopap   }
          closePopap              = { this.closePopap              }
          closeLoginPopap         = { this.closeLoginPopap         }
          closeAllPopap           = { this.closeAllPopap           }
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
