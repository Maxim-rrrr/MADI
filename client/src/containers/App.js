import React, { Component } from 'react';
import { connect } from "react-redux";
import { customersFetchData } from "../actions/customers";

import Header from './Header'
import Admin from './Admin';


class App extends Component {
  constructor(props) {
    super (props)
    this.state = {
      login: false,
      email: localStorage.getItem('email'),
      admin: false
    } 
  }

  componentDidMount() {

    this.props.fetchData("/api/customers");
    if (this.state.email !== null) {
      this.setState({
        login: true
      })
    }

    if (this.state.email === 'admin@admin') {
      this.setState({
        admin: true
      })
    }
    
  }

  customersUpdataDB() {
    this.props.fetchData("/api/customers");
  }

  loginUpdata(bool) {
    this.setState({
      login: bool,
      email: localStorage.getItem('email')
    })
  }

  render() {
    let content = <></>
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
    customers: state.customers
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchData: url => dispatch(customersFetchData(url))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
