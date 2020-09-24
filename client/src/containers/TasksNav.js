import React, { Component } from 'react'

export default class TasksNav extends Component {
  render() {
    return (
      <nav className='tasks-nav'>
        <button 
          className='tasks-nav__tab animated fadeIn' 
          onClick = { () => { this.props.navEdit({
            subject: null,
            work: null,
            variant: null,
            tasks: null
          }) } }
        > Предметы </button>

        { 
          this.props.navState.subject ? 
          <button 
            className = 'tasks-nav__tab animated fadeIn' 
            onClick   = { () => { this.props.navEdit({ 
              subject: this.props.navState.subject,
              work: null,
              variant: null
            }) } }
          > { this.props.navState.subject } </button> : ''
        }

        {
          this.props.navState.work ? 
          <button 
            className = 'tasks-nav__tab animated fadeIn' 
            onClick   = { () => { this.props.navEdit({ 
              subject: this.props.navState.subject,
              work: this.props.navState.work,
              variant: null
            }) } }
          > { this.props.navState.work } </button> : ''
        }

        {
          this.props.navState.variant ? 
          <button 
            className = 'tasks-nav__tab animated fadeIn' 
            onClick   = { () => { this.props.navEdit({ 
              subject: this.props.navState.subject,
              work: this.props.navState.work,
              variant: this.props.navState.variant
            }) } }
          > { this.props.navState.variant } Вариант </button> : ''
        }


      </nav>
    )
  }
}

