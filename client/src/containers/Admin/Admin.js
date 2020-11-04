import React, { Component } from 'react'
import { connect } from "react-redux";
import { customersFetchData } from "../../actions/customers";
import CustomerList from './components/CustomerList'
import Tasks from './components/Tasks';
import Subjects from './components/Subjects';

class Admin extends Component {
  constructor(props){
    super (props)
    this.state = {
      tab: localStorage.getItem('tab_admin')?localStorage.getItem('tab_admin'):'CustomerList'
    }
  }

  componentDidMount() {
    this.props.fetchData("/api/customers");
    
  }

  customersUpdataDB() {
    this.props.fetchData("/api/customers");
  }

  exit() {
    localStorage.setItem('token-admin', '')
    window.location.reload()
  }

  render() {
    let balances = []
    this.props.customers.map( value => balances.push(value.balance) )
    return (
      <>       
        <header className="header">
          <div className="container">
            <div className="header__content">

              <div className="header__logo">
                <img src="./img/logo.png" alt="Logo"/>
                <h1 className='header__title'> РГР работы МАДИ </h1>
              </div>

              <div className="header__admin-label">
                АДМИНИСТРАТОР
                <button className="account__exit" onClick={ () => (this.exit()) }>
                  <img src="./img/exit.png" alt=""/>
                </button>
              </div>

            </div>
          </div>
        </header>

        <div className='container'>
          <nav className='admin__nav'>
            {
              [['CustomerList', 'Пользователи'], ['Tasks', 'Задания'], ['Subjects', 'Предметы']].map(value => {
                let active = ''
                if (value[0] === this.state.tab) {
                  active = ' admin__nav-item--active'
                }
                return (
                  <div 
                    key = {value[0]}
                    className={'admin__nav-item' + active} 
                    onClick = {() => { 
                      localStorage.setItem('tab_admin', value[0])
                      this.setState({ tab: value[0] }) 
                    }}
                  > { value[1] } </div>
                )
              })
            }
          </nav>
        </div>
        

        <CustomerList 
          tab = { this.state.tab } 
          customers = { this.props.customers }
          balances = { balances } 
          customersUpdataDB = { () => { this.customersUpdataDB() } }
        />

        <Tasks
          tab = { this.state.tab } 
        />

        <Subjects
          tab = { this.state.tab } 
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