import React, { Component } from 'react';
import { connect } from "react-redux";
import { customersFetchData } from "../actions/customers";


class App extends Component {
  componentDidMount() {
    this.props.fetchData("/api/customers");
  }

  render() {
    return (
      <div>
          <ul>
              {this.props.customers.map((customers, index)=> {
                return <li key={index}>
                  <div>Name is: {customers.email}</div>
                  <div>Age is: {customers.password}</div>
                  <div>Status is: {customers.balance}</div>
                  <div>Mugger ID is: {customers._id}</div>
                </li>
              })}

          </ul>
      </div>
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
