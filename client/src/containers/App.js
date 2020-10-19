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
      login: false,
      token: localStorage.getItem('token'),
      admin: false
    } 
  }

  componentDidMount() {

    if (this.state.token !== null && this.state.token !== '0') {
      this.setState({
        login: true
      })
    }

    if (this.state.token === 'NYqtUUpzC5Je6oDw55UMiTkxVKFyLKHb+RsHNtybEKA=') {
      this.setState({
        admin: true
      })
    }
    
    
  }

  loginUpdata(bool) {
    this.setState({
      login: bool,
      token: localStorage.getItem('token')
    })
  }

  render() {
    let content = <User/>
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
        />

        { content }
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    getCustomerResponse: state.customer
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCustomer: url => dispatch(getCustomer(url))
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(App);
