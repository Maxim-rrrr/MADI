import React, { Component } from 'react'

import { connect } from "react-redux";
import { getCustomer } from '../../actions/getCustomer'

import Header from './Header'
import User from './User'
import Invite from './Invite'

class UserPage extends Component {
  constructor(props) {
    super (props)
    this.state = {
      requestCounter: 1,
      login: false,
      token: localStorage.getItem('token'),

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

  componentDidMount() {

    if (this.state.token !== null && this.state.token !== '0') {
      this.setState({
        login: true
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

  render() {
    return (
      <>
        { localStorage.getItem('token') && <Invite/> }

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

        <User 
          activeLoginPopup = { this.activeLoginPopup }
          userUpdata = { () => {this.userUpdata()} }
          activeAddBalancePopup   = { this.activeAddBalancePopup }
        />

      </>
    )
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


export default connect(mapStateToProps, mapDispatchToProps)(UserPage);