import React, { Component } from 'react'
import { connect } from 'react-redux'

import { getTasks } from '../actions/getTasks'
import { setTask } from '../actions/setTask'
import { addImg } from '../actions/addImg'


import TasksNav from './TasksNav'

class Tasks extends Component {
  constructor(props) {
    super(props)
    this.state = {

      navState: {
        subject: null,
        categories: []
      },
      prevImg: ''
    };

  }

  navEdit(navState) {
    this.setState({
      navState: navState
    })
  }

  componentDidMount() {
    this.props.getTasks('/api/getTasks')
    setInterval(this.props.getTasks('/api/getTasks'), 10)
  }
  
  // Изменение категории
  editInCategory(value, type, index = 0, indexImg = 0) {
    let subjectName = this.state.navState.subject
    let categories = this.state.navState.categories

    let subjects
    if (this.props.getTasksResponse) {
      subjects = this.props.getTasksResponse.tasks
    }

    let subject
    if (subjectName) {
      subjects.forEach(item => {
        if (item.name === subjectName) {
          subject = item
        }
      })
    }

    let categoriesIndex = []
    let temp
    temp = subject.tasks
    categories.forEach(item => {
      temp.forEach((task, index) => {
        if (task.name === item) {
          categoriesIndex.push(index)
          temp = task.tasks
        }
      })
    })

    let c = categoriesIndex
    switch(categories.length) {
      case 0:
        if (type === 'add') {
          subject.tasks.push({
            name: value,
            tasks: []
          })
        } else if (type === 'remove') {
          subject.tasks.splice(value, 1)
        } else if (type === 'number') {
          if (+value === 0) {
            subject.tasks = []
          } else if (subject.tasks.length > +value) {
            subject.tasks = subject.tasks.slice(0, value)
          } else {
            for (let j = value - subject.tasks.length; j > 0; j--) {
              subject.tasks.push({
                "prise" : 20,
                "img" : []
              })
            }
          }
        } else if (type === 'img-add') {
          subject.tasks[index].img.push(value)
        } else if (type === 'img-remove') {
          subject.tasks[index].img.splice(indexImg, 1)
        } else if (type === 'prise') {
          subject.tasks[index].prise = value
        }

        this.props.setTask('/api/setTask/' + subject._id, {"tasks": subject.tasks})
        this.props.getTasks('/api/getTasks')

        break
      case 1: 
        if (type === 'add') {
          subject.tasks[c[0]].tasks.push({
            name: value,
            tasks: []
          })
        } else if (type === 'remove') {
          
          subject.tasks[c[0]].tasks.splice(value, 1)
        } else if (type === 'number') {
          if (+value === 0) {
            subject.tasks[c[0]].tasks = []
          } else if (subject.tasks[c[0]].tasks.length > +value) {
            subject.tasks[c[0]].tasks = subject.tasks[c[0]].tasks.slice(0, value)
          } else {
            for (let j = value - subject.tasks[c[0]].tasks.length; j > 0; j--) {
              subject.tasks[c[0]].tasks.push({
                "prise" : 20,
                "img" : []
              })
            }
          }
        } else if (type === 'img-add') {
          subject.tasks[c[0]].tasks[index].img.push(value)
        } else if (type === 'img-remove') {
          subject.tasks[c[0]].tasks[index].img.splice(indexImg, 1)
        } else if (type === 'prise') {
          subject.tasks[c[0]].tasks[index].prise = value
        }
        this.props.setTask('/api/setTask/' + subject._id, {"tasks": subject.tasks})
        this.props.getTasks('/api/getTasks')
        break
      case 2:
        if (type === 'add') {
          subject.tasks[c[0]].tasks[c[1]].tasks.push({
            name: value,
            tasks: []
          })
        } else if (type === 'remove') {  
          subject.tasks[c[0]].tasks[c[1]].tasks.splice(value, 1)
        } else if (type === 'number') {
          if (+value === 0) {
            subject.tasks[c[0]].tasks[c[1]].tasks = []
          } else if (subject.tasks[c[0]].tasks[c[1]].tasks.length > +value) {
            subject.tasks[c[0]].tasks[c[1]].tasks = subject.tasks[c[0]].tasks[c[1]].tasks.slice(0, value)
          } else {
            for (let j = value - subject.tasks[c[0]].tasks[c[1]].tasks.length; j > 0; j--) {
              subject.tasks[c[0]].tasks[c[1]].tasks.push({
                "prise" : 20,
                "img" : []
              })
            }
          }
        } else if (type === 'img-add') {
          subject.tasks[c[0]].tasks[c[1]].tasks[index].img.push(value)
        } else if (type === 'img-remove') {
          subject.tasks[c[0]].tasks[c[1]].tasks[index].img.splice(indexImg, 1)
        } else if (type === 'prise') {
          subject.tasks[c[0]].tasks[c[1]].tasks[index].prise = value
        }
        this.props.setTask('/api/setTask/' + subject._id, {"tasks": subject.tasks})
        this.props.getTasks('/api/getTasks')
        break
      case 3:
        if (type === 'add') {
          subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks.push({
            name: value,
            tasks: []
          })
        } else if (type === 'remove') {  
          subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks.splice(value, 1)
        } else if (type === 'number') {
          if (+value === 0) {
            subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks = []
          } else if (subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks.length > +value) {
            subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks = subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks.slice(0, value)
          } else {
            for (let j = value - subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks.length; j > 0; j--) {
              subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks.push({
                "prise" : 20,
                "img" : []
              })
            }
          } 
        } else if (type === 'img-add') {
          subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[index].img.push(value)
        } else if (type === 'img-remove') {
          subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[index].img.splice(indexImg, 1)
        } else if (type === 'prise') {
          subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[index].prise = value
        }
        this.props.setTask('/api/setTask/' + subject._id, {"tasks": subject.tasks})
        this.props.getTasks('/api/getTasks')
        break
      case 4:
        if (type === 'add') {
          subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks.push({
            name: value,
            tasks: []
          })
        } else if (type === 'remove') {  
          subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks.splice(value, 1)
        } else if (type === 'number') {
          if (+value === 0) {
            subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks = []
          } else if (subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks.length > +value) {
            subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks = subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks.slice(0, value)
          } else {
            for (let j = value - subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks.length; j > 0; j--) {
              subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks.push({
                "prise" : 20,
                "img" : []
              })
            }
          }
        } else if (type === 'img-add') {
          subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[index].img.push(value)
        } else if (type === 'img-remove') {
          subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[index].img.splice(indexImg, 1)
        } else if (type === 'prise') {
          subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[index].prise = value
        }
        this.props.setTask('/api/setTask/' + subject._id, {"tasks": subject.tasks})
        this.props.getTasks('/api/getTasks')
        break
      case 5:
        if (type === 'add') {
          subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks.push({
            name: value,
            tasks: []
          })
        } else if (type === 'remove') {  
          subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks.splice(value, 1)
        } else if (type === 'number') {
          if (+value === 0) {
            subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks = []
          } else if (subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks.length > +value) {
            subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks = subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks.slice(0, value)
          } else {
            for (let j = value - subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks.length; j > 0; j--) {
              subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks.push({
                "prise" : 20,
                "img" : []
              })
            }
          }
        } else if (type === 'img-add') {
          subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[index].img.push(value)
        } else if (type === 'img-remove') {
          subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[index].img.splice(indexImg, 1)
        } else if (type === 'prise') {
          subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[index].prise = value
        }
        this.props.setTask('/api/setTask/' + subject._id, {"tasks": subject.tasks})
        this.props.getTasks('/api/getTasks')
        break
      case 6:
        if (type === 'add') {
          subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks.push({
            name: value,
            tasks: []
          })
        } else if (type === 'remove') {  
          subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks.splice(value, 1)
        } else if (type === 'number') {
          if (+value === 0) {
            subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks = []
          } else if (subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks.length > +value) {
            subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks = subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks.slice(0, value)
          } else {
            for (let j = value - subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks.length; j > 0; j--) {
              subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks.push({
                "prise" : 20,
                "img" : []
              })
            }
          }
        } else if (type === 'img-add') {
          subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks[index].img.push(value)
        } else if (type === 'img-remove') {
          subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks[index].img.splice(indexImg, 1)
        } else if (type === 'prise') {
          subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks[index].prise = value
        }
        this.props.setTask('/api/setTask/' + subject._id, {"tasks": subject.tasks})
        this.props.getTasks('/api/getTasks')
        break
      case 7:
        if (type === 'add') {
          subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks[c[7]].tasks.push({
            name: value,
            tasks: []
          })
        } else if (type === 'remove') {  
          subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks[c[7]].tasks.splice(value, 1)
        } else if (type === 'number') {
          if (+value === 0) {
            subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks[c[7]].tasks = []
          } else if (subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks[c[7]].tasks.length > +value) {
            subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks[c[7]].tasks = subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks[c[7]].tasks.slice(0, value)
          } else {
            for (let j = value - subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks[c[7]].tasks.length; j > 0; j--) {
              subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks[c[7]].tasks.push({
                "prise" : 20,
                "img" : []
              })
            }
          }
        } else if (type === 'img-add') {
          subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks[c[7]].tasks[index].img.push(value)
        } else if (type === 'img-remove') {
          subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks[c[7]].tasks[index].img.splice(indexImg, 1)
        } else if (type === 'prise') {
          subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks[c[7]].tasks[index].prise = value
        }
        this.props.setTask('/api/setTask/' + subject._id, {"tasks": subject.tasks})
        this.props.getTasks('/api/getTasks')
        break
      case 8:
        if (type === 'add') {
          subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks[c[7]].tasks[c[8]].tasks.push({
            name: value,
            tasks: []
          })
        } else if (type === 'remove') {  
          subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks[c[7]].tasks[c[8]].tasks.splice(value, 1)
        } else if (type === 'number') {
          if (+value === 0) {
            subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks[c[7]].tasks[c[8]].tasks = []
          } else if (subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks[c[7]].tasks[c[8]].tasks.length > +value) {
            subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks[c[7]].tasks[c[8]].tasks = subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks[c[7]].tasks[c[8]].tasks.slice(0, value)
          } else {
            for (let j = value - subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks[c[7]].tasks[c[8]].tasks.length; j > 0; j--) {
              subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks[c[7]].tasks[c[8]].tasks.push({
                "prise" : 20,
                "img" : []
              })
            }
          }
        } else if (type === 'img-add') {
          subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks[c[7]].tasks[c[8]].tasks[index].img.push(value)
        } else if (type === 'img-remove') {
          subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks[c[7]].tasks[c[8]].tasks[index].img.splice(indexImg, 1)
        } else if (type === 'prise') {
          subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks[c[7]].tasks[c[8]].tasks[index].prise = value
        }
        this.props.setTask('/api/setTask/' + subject._id, {"tasks": subject.tasks})
        this.props.getTasks('/api/getTasks')
        break
      default:
        break
    }
  }

  // Добавление изображение
  addImg(event) {
    event.preventDefault()

    // Отправка файла на сервер 
    const formData = new FormData()
    formData.append('myFile', event.target.children[0].files[0])
    this.props.addImg('/api/addImg', formData)

    let addImgTimer = setInterval(() => {
      if (this.props.addImgResponse) {
        if (this.props.addImgResponse.originalname !== this.state.prevImg) {
          // Добавление файла к определённому заданию
          let fileName = this.props.addImgResponse.filename
    
          let tasks = this.props.getTasksResponse.tasks 
    
          // Вынесем нужный предмет в отдельную переменную
          let subject
    
          tasks.forEach((value) => {
            if (value.name === this.state.navState.subject) {
              subject = value
            }
          })
    
          // Добавим решение
          this.editInCategory(fileName, 'img-add')

          this.setState({
            prevImg: this.props.addImgResponse.originalname
          })
          clearInterval(addImgTimer)

        }
      }
    }, 10)
    
    event.target.reset()
  }

  render() {
    
    let subjects

    if (this.props.getTasksResponse) {
      subjects = this.props.getTasksResponse.tasks
    }
    
    let nav = this.state.navState

    let subject
    if (nav.subject) {
      subjects.forEach(item => {
        if (item.name === nav.subject) {
          subject = item
        }
      })
    }
    
    let contentPage
    if (nav.subject) {
      if (nav.categories.length === 0) {       
        contentPage = subject.tasks
        
      } else {
        contentPage = subject.tasks
        nav.categories.forEach(item => {
          contentPage.forEach(task => {
            if (task.name === item) {
              contentPage = task.tasks
            }
          })
        })
      }
    }
    

    let content = <></>
    // Предметы
    if (!nav.subject && nav.categories.length === 0) {
      content = <>
        { 
          subjects ? subjects.map(elem => {
            return (
              <div className='tasks__btn-group' key = {elem.name}>
                <button className="btn tasks__btn-category"  onClick = { () => {this.navEdit({subject: elem.name, categories: []})} }>
                  { elem.name } 
                </button>
              </div>
            )
          }) : ''
        }
      </>
    // Первая категория
    } else if (nav.subject && nav.categories.length === 0) {
      content = <>
        {
          contentPage ? contentPage.map((elem, index) => {
            return (
              <div className='tasks__btn-group' key = {elem.name}>
                <button className="btn tasks__btn-category" onClick = { () => {this.navEdit({subject: this.state.navState.subject, categories: [elem.name]})} }>
                  { elem.name } 
                </button>

                <button className="tasks__btn-close" onClick = {() => { this.editInCategory(index, 'remove') }}>
                  <img src="./img/close.png" alt=""/> 
                </button>
              </div>
            )
          }) : '' 
        }
        <form 
          onSubmit = { (event) => { 
            event.preventDefault()  
            this.editInCategory(event.target[0].value, 'add') 
            event.target[0].value = ''
          } } 
          className="tasks__form"
        >
          <input 
            type = 'text' 
            className = 'input tasks__input' 
            placeholder = 'Добавить...'
          />
          <button type='submit' className="customer-list__btn" />
        </form>
      </>
    // Категории
    } else if (nav.subject && nav.categories.length !== 0 && nav.categories.length < subject.model) {
      content = <>
        {
          contentPage ? contentPage.map((elem, index) => {
            return (
              <div className='tasks__btn-group' key = {elem.name}>
                <button className="btn tasks__btn-category" onClick = { () => {this.navEdit({subject: this.state.navState.subject, categories: [...this.state.navState.categories,elem.name]})} }>
                  { elem.name } 
                </button>

                <button className="tasks__btn-close" onClick = {() => { this.editInCategory(index, 'remove')}}>
                  <img src="./img/close.png" alt=""/> 
                </button>
              </div>
            )
          }) : ''
        }
        <form 
          onSubmit = { (event) => { 
            event.preventDefault()
            this.editInCategory(event.target[0].value, 'add') 
            event.target[0].value = ''
          } } 
          className="tasks__form"
        >
          <input 
            type = 'text' 
            className = 'input tasks__input' 
            placeholder = 'Добавить...'
          />
          <button type='submit' className="customer-list__btn" />
        </form>
      </>
    // Задания
    } else {
      content = <>
        {/* Изменение кол-во заданий */}
        <form 
          onSubmit = { (event) => { 
            event.preventDefault() 
            let value = event.target.children[1].value
            event.target.children[1].value = ''
            this.editInCategory(value, 'number')
          } } 
          className="varisnt-form" 
        >
          <span className="varisnt-form__label"> Заданий </span>

          <input 
            type="number" 
            className="input varisnt-form__input" 
            placeholder={ contentPage.length }
          />

          <button type='submit' className="varisnt-form__btn" />
        </form>

        {
          contentPage ? contentPage.map((elem, index) => {
            return (
              <div key = {index} className="task-card">

                <span className="task-card__title"> Задание { index + 1 } </span>

                {/* Изменение цены заданий */}
                <form onSubmit = { (event) => { 
                  event.preventDefault()
                  let value = event.target.children[1].value
                  event.target.children[1].value = ''
                  this.editInCategory(value, 'prise', index)
                } }  className="prise-form">
                  <span className = "prise-span" > Цена: </span>
                  
                  <input 
                    type = "number" 
                    className = "input varisnt-form__input" 
                    placeholder = { elem.prise }
                  />

                  <span className = "prise-span" > руб. </span>
                  
                  <button type='submit' className="varisnt-form__btn" />
                </form>

                {/* Решение */}
                <div className="task-card__imgs-box">
                  {
                    elem.img.map((img, i) => {
                      return (
                        <div className="img-box">
                          <img 
                            key = {img}
                            src = {'http://localhost:4000/uploads/' + img} 
                            alt = ''
                          />
                          <button className='btn-img-del' onClick = {(event) => {
                            event.preventDefault();
                            this.editInCategory('', 'img-remove', index, i)
                          }}/>
                        </div>
                      )
                    })
                  }
                  
                  <form 
                    onSubmit = {(event) => {this.addImg(event, index)}}
                    className = 'form form-add-img'
                    encType = 'multipart/form-data'
                  >
                    <input 
                      className = 'add-img' 
                      type = 'file' 
                      name = 'myFile'
                    />
                    <button className='varisnt-form__btn'></button>
                  </form>
                </div>
                
              </div>
            )
          }) : ''
        }
      </>
    }


    if (this.props.tab === 'Tasks') {
      return (
        <>
          
          <div className = 'tasks animated fadeIn'>
            <div className = 'container'>
              <TasksNav 
                navState = { this.state.navState }
                navEdit  = { (navState) => { this.navEdit(navState) } }
              />

              <div className="tasks__content">
                { content }
              </div>
            </div>
          </div>    
        </>    
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
    addImgResponse: state.addImg,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getTasks: (url) => dispatch(getTasks(url)),
    setTask: (url, data) => dispatch(setTask(url, data)),
    addImg: (url, imgData) => dispatch(addImg(url, imgData))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);