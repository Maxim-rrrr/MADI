import React, { Component } from 'react';
import { connect } from "react-redux";
import { customersFetchData } from "../actions/customers";

import Header from './Header'


class App extends Component {
  constructor(props) {
    super (props)
    this.state = {
      login: false,
      email: localStorage.getItem('email')
    } 
  }

  componentDidMount() {
    this.props.fetchData("/api/customers");

    if (this.state.email !== null) {
      this.setState({
        login: true
      })
    }

    // localStorage.clear();
  }

  loginUpdata(bool) {
    this.setState({
      login: bool,
      email: localStorage.getItem('email')
    })
  }

  render() {
    
    
    return (
      <>
        <Header 
          customers = { this.props.customers } 
          logIn = { this.state.login }
          loginUpdata = { (bool) => { this.loginUpdata(bool) } }
        />
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
