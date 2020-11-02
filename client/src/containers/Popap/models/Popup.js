import React, { Component } from 'react'

export default class Popup extends Component {
  defaultProps = {
    active: false,
    title: 'title',
    error: '',
    children: <></>
  }

  bgClose(event) {
    if (event.target.className === 'popup popup--active') {
      this.props.close()
    }
  }

  render() {
    return (
      <div className = {this.props.active?'popup popup--active':'popup'} onClick = { (event) => {this.bgClose(event)} }>
        <div className="popup__window">
          <button className="popup__close-btn" onClick = { () => {this.props.close()} }>
            <img src="./img/close.png" alt="" className="popup__close-img"/>
          </button>
          <div className="popup__title"> { this.props.title } </div>
          <div className="popup__invalid-label"> { this.props.error } </div>

          { this.props.children }

        </div>
      </div>
    )
  }
}
