import React, { Component } from 'react'
import { connect } from "react-redux";
import { customersFetchData } from "../actions/customers";
import CustomerList from './CustomerList'

class Admin extends Component {
  constructor(props){
    super (props)
    this.state = {
      tab: 'CustomerList'
    }
  }

  componentDidMount() {
    this.props.fetchData("/api/customers");
    
  }

  customersUpdataDB() {
    this.props.fetchData("/api/customers");
  }

  render() {
    let balances = []
    this.props.customers.map((value, index) => {
      balances.push(value.balance)
    })
    return (
      <>       
        <div className='container'>
          <nav className='admin__nav'>
            {
              [['CustomerList', 'Пользователи'], ['BD', 'Задания']].map(value => {
                let active = ''
                if (value[0] === this.state.tab) {
                  active = ' admin__nav-item--active'
                }
                return (
                  <div 
                    className={'admin__nav-item' + active} 
                    onClick = {() => { this.setState({ tab: value[0] }) }}
                  > { value[1] } </div>
                )
              })
            }
          </nav>
        </div>
        

        <CustomerList 
          tab={ this.state.tab } 
          customers = { this.props.customers }
          balances = { balances } 
          customersUpdataDB = { () => { this.customersUpdataDB() } }
        />
      </>
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(Admin);