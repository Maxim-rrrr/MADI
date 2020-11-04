import React, { Component } from 'react'

import Admin from './Admin'
import Auth from './Auth'

import { connect } from 'react-redux'
import { isAdmin } from "../../actions/isAdmin";

class AdminPage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      content: <Auth />
    }
  }

  componentDidMount() {
    if (localStorage.getItem('token-admin')) {
      if (localStorage.getItem('token-admin') !== '') {
        // Отправляем на проверку
        this.props.isAdmin('/api/isAdmin', {
          token: localStorage.getItem('token-admin'),
          userToken: localStorage.getItem('token')
        })

        let timer = setInterval(() => {
          if (this.props.isAdminResponse !== '') {

            if (this.props.isAdminResponse.status === 200) {
              this.setState({
                content: <Admin />
              })
              
            }

            clearInterval(timer)
          }
        })
      }
    }
  }

  render() {
    return (
      <>
        { this.state.content }
      </>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isAdminResponse: state.isAdmin,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    isAdmin: (url, data) => dispatch(isAdmin(url, data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage)
