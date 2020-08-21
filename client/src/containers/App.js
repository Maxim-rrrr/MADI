import React, { Component } from 'react';

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

export default App;
