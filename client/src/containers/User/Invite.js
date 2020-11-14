import React, { Component } from 'react'
import inviteImg from '../../img/invite.png'
import copyImg from '../../img/copy.png'

export default class Invite extends Component {
  constructor(props) {
    super(props)

    this.state = {
      active: true
    }
  }

  copyLink() {
    let link = document.querySelector('.invite-user__copy-link')

    link.select()

    document.execCommand("copy")
  }

  render() {
    function cryptor(value) {
      const crypto = require("crypto");
      let sha256 = crypto.createHash("sha256")
      sha256.update(value + '', "utf8")

      return sha256.digest("base64")
    }

    let link = cryptor(localStorage.getItem('email')).split('/').join('')
    return (
      <>
        {
          this.state.active?
          <div className = 'invite-user invite-user--active'>

            <div className='invite-user__close-box'>
              <button className='invite-user__close-btn' onClick = {() => { this.setState({ active: false }) }}/>
            </div>

            <div className="invite-user__text"> Пригласи друзей и получай 10% от их покупок </div>
            <div className="invite-user__copy-box">
              <input className="invite-user__copy-link" type="text" value = { 'http://rgrmadi.ru/invite/' + link }/>
              <div className="invite-user__copy-btn" onClick = {() => {this.copyLink()}} > 
                <img src={copyImg} alt=""/> 
              </div>
            </div>
          </div>
          :
          <div className = 'invite-user' onClick = { () => { this.setState({ active: true }) } }>
            <img src = { inviteImg } alt=""/>
          </div>

        }
      </>
    )
  }
}
