import React, { Component } from 'react'

export default class ErrorPage extends Component {
  render() {
    return (
      <div className = 'error-page'>
        <div className="error-page__code"> { this.props.code } </div>
        <div className="error-page__message"> { this.props.message } </div>
      </div>
    )
  }
}
