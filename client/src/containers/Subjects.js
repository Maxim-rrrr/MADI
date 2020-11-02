import React, { Component } from 'react'
import { connect } from 'react-redux'

import { getTasks } from '../actions/getTasks'
import { setTask } from '../actions/setTask'
import { addTask } from '../actions/addTask'
import { removeTask } from '../actions/removeTask'

class Subjects extends Component {
  constructor (props) {
    super(props)
    this.state = {
      error: false,
      editPublicTrue: [],
      editPublicFalse: []
    }
  }

  componentDidMount() {
    this.props.getTasks('/api/getTasks')
  }

  createSubject(event) {
    event.preventDefault()
    
    // Название предмета
    let name = event.target[0].value.trim()
    if (name.length > 1) {
      name = name[0].toUpperCase() + name.slice(1).toLowerCase()
    }
    
    // Модель
    let model =  event.target[1].value.replace( /\s/g, "")
    
    let error = false

    // Проверки -------------------------------------------
    if (name === '' || model === '') {
      error = true
    } else if (+model < 1) {
      error = true
    }

    this.props.getTasksResponse.tasks.forEach(item => {
      if (item.name === name) {
        error = true
      }
    })
   // -----------------------------------------------------

    if (error) {
      this.setState({ error: true })
      setTimeout(() => {
        this.setState({ error: false })
      }, 400)
    } else {
      event.target[0].value = ''
      event.target[1].value = ''

      this.props.addTask('/api/addTask', { name, model })   
      this.props.getTasks('/api/getTasks')
    }

  }

  deleteSubject(id) {
    this.props.removeTask(`/api/removeTask/${id}`)
    this.props.getTasks('/api/getTasks')
  }

  public(id, value) {
    this.props.setTask('/api/setTask/' + id, {"public": value})
    if (value) {
      let editPublicFalse = this.state.editPublicFalse
      editPublicFalse.includes(id)?editPublicFalse.splice(editPublicFalse.indexOf(id), 1):console.log()

      this.setState({
        editPublicTrue: [...this.state.editPublicTrue, id],
        editPublicFalse
      })
    } else {
      let editPublicTrue = this.state.editPublicTrue
      editPublicTrue.includes(id)?editPublicTrue.splice(editPublicTrue.indexOf(id), 1):console.log()

      this.setState({
        editPublicFalse: [...this.state.editPublicFalse, id],
        editPublicTrue
      })
    }
  }

  render() {
    let subjects

    if (this.props.getTasksResponse) {
      subjects = this.props.getTasksResponse.tasks
    }

    if (this.props.tab === 'Subjects') {
      return (
        <div className = 'subjects animated fadeIn'>
          <div className = 'container'>

            <form 
              onSubmit = { (event) => { this.createSubject(event) } } 
              className = {
                this.state.error?
                'subjects__create-form subjects__create-form--error':
                'subjects__create-form'
              }
            >
              <div className='subjects__create-form-title'> Создать предмет </div>
              <div className='subjects__create-form-input-box'>
                <input 
                  type = 'text' 
                  className = 'input subjects__create-form-input'
                  placeholder = 'Название'
                />
                <input 
                  type = 'number' 
                  className = 'input subjects__create-form-input'
                  placeholder = 'Модель'
                />
              </div>
              <button className = 'btn subjects__create-form-btn'> Создать </button>
            </form>

            { 
              subjects ? subjects.map(elem => {
                return (
                  
                  <div 
                    key = {elem._id}
                    className = {
                      (elem.public || this.state.editPublicTrue.includes(elem._id)) && !this.state.editPublicFalse.includes(elem._id)?
                      'subjects__card subjects__card--public':
                      'subjects__card'
                    }>
                    <div className='subjects__card-btn-del' onClick = {() => { this.deleteSubject(elem._id) }} ></div>
                    <div className = 'subjects__card-info'>
                      <div className = 'subjects__card-name'> { elem.name } </div>
                      <div className = 'subjects__card-model'> Модель:  {elem.model} </div>
                    </div>

                    <div className = 'subjects__card-public-box'>
                      <div className = 'subjects__card-public-text'> Публикация </div>
                      <div 
                        className = {
                          (elem.public || this.state.editPublicTrue.includes(elem._id)) && !this.state.editPublicFalse.includes(elem._id)?
                          'toggel-public toggel-public--true':
                          'toggel-public toggel-public--false'
                        }
                        onClick = { () => { 
                          if (this.state.editPublicTrue.includes(elem._id)) {
                            this.public(elem._id, false) 
                          } else if (this.state.editPublicFalse.includes(elem._id)) {
                            this.public(elem._id, true) 
                          } else {
                            this.public(elem._id, !elem.public)
                          }

                        } }
                      ><span></span>
                      </div>
                    </div>

                  </div>
                )
              }) : ''
            }
          </div>
        </div>
      )
    } else {
      return <></>
    }
  }
}

const mapStateToProps = (state) => {
  return {
    getTasksResponse: state.getTasks,
    setTaskResponse: state.setTask,
    addTaskResponse: state.addTask,
    removeTaskResponse: state.removeTask,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getTasks: (url) => dispatch(getTasks(url)),
    setTask: (url, data) => dispatch(setTask(url, data)),
    addTask: (url, name) => dispatch(addTask(url, name)),
    removeTask: (url) => dispatch(removeTask(url)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Subjects);