import React, { Component } from 'react'

export default class TasksNav extends Component {
  render() {
    return (
      <nav className='tasks-nav'>
        <button 
          className='tasks-nav__tab animated fadeIn' 
          onClick = { () => { this.props.navEdit({
            subject: null,
            categories: []
          }) } }
        > Предметы </button>

        { 
          this.props.navState.subject?
          
              <button 
                className = 'tasks-nav__tab animated fadeIn' 
                onClick   = { () => {         
                  this.props.navEdit({ 
                    subject: this.props.navState.subject,
                    categories: []
                  })
                }}
              > 
                { this.props.navState.subject } 
              </button>: ''
        }

        { 
          this.props.navState.categories?
          this.props.navState.categories.map(item => {
            return (
              <button 
                className = 'tasks-nav__tab animated fadeIn' 
                onClick   = { () => {         
                  let categories = this.props.navState.categories
                  categories = categories.slice(0, categories.indexOf(item) + 1)
                  this.props.navEdit({ 
                    subject: this.props.navState.subject,
                    categories: categories
                  })
                }}
              > 
                { item } 
              </button>

            )
          }): ''
        }

      </nav>
    )
  }
}

