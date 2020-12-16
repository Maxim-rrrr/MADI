import React, { Component } from 'react'
import { connect } from 'react-redux'

import { getTasks } from '../../../actions/getTasks'
import { setTask } from '../../../actions/setTask'
import { addImg } from '../../../actions/addImg'

import fileImg from '../../../img/files.png'

import TasksNav from './TasksNav'
import Popup from '../../Popup/models/Popup'

class Tasks extends Component {
  constructor(props) {
    super(props)
    this.state = {

      navState: {
        subject: null,
        categories: []
      },
      prevImg: '',
      activePopupsDel: [],
      activePopupsDecision: []
    };

  }

  navEdit(navState) {
    this.setState({
      navState: navState
    })
  }

  componentDidMount() {
    this.props.getTasks('/api/getTasks')
    setInterval(() => {
      this.props.getTasks('/api/getTasks')
      this.setState({ 
        getTasksResponse: this.props.getTasksResponse
      })
    }, 1000)
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
    let T
    switch(categories.length) {
      case 0:
        T = subject
        break
      case 1: 
        T = subject.tasks[c[0]]
        break
      case 2:
        T = subject.tasks[c[0]].tasks[c[1]]
        break
      case 3:
        T = subject.tasks[c[0]].tasks[c[1]].tasks[c[2]]
        break
      case 4:
        T = subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]]
        break
      case 5:
        T = subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]]
        break
      case 6:
        T = subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]]
        break
      case 7:
        T = subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks[c[6]]
        break
      case 8:
        T = subject.tasks[c[0]].tasks[c[1]].tasks[c[2]].tasks[c[3]].tasks[c[4]].tasks[c[5]].tasks[c[6]].tasks[c[7]]
        break
      default:
        break
    }

    if (type === 'add') {
      T.tasks.push({
        name: value,
        tasks: []
      })
    } else if (type === 'remove') {  
      T.tasks.splice(value, 1)
    } else if (type === 'number') {
      if (+value === 0) {
        T.tasks = []
      } else if (T.tasks.length > +value) {
        T.tasks = T.tasks.slice(0, value)
      } else {
        for (let j = value - T.tasks.length; j > 0; j--) {
          T.tasks.push({
            "prise" : 20,
            "img" : [],
            "description": '',
            "conditionFile": '',
            "conditionText": '',
          })
        }
      }
    } else if (type === 'img-add') {
      T.tasks[index].img.push(value)
    } else if (type === 'img-remove') {
      T.tasks[index].img.splice(indexImg, 1)
    } else if (type === 'prise') {
      T.tasks[index].prise = value
    } else if (type === 'add-file-condition') {
      T.tasks[index].conditionFile = value
    } else if (type === 'remove-file-condition') {
      T.tasks[index].conditionFile = ''
    } else if (type === 'edit-text-condition') {
      T.tasks[index].conditionText = value
    } else if (type === 'edit-description') {
      T.tasks[index].description = value
    }


    this.props.setTask('/api/setTask/' + subject._id, {"tasks": subject.tasks})
    this.props.getTasks('/api/getTasks')
  }

  // Добавление изображение
  addImg(event, index) {
    event.preventDefault()

    // Отправка файла на сервер 
    const formData = new FormData()
    formData.append('myFile', event.target.children[0].files[0])
    this.props.addImg('/api/addImg', formData)

    let addImgTimer = setInterval(() => {
      if (this.props.addImgResponse) {
        if (this.props.addImgResponse.filename !== this.state.prevImg) {
          // Добавление файла к определённому заданию
          let fileName = this.props.addImgResponse.filename
    
          // Добавим решение
          this.editInCategory(fileName, 'img-add', index)

          this.setState({
            prevImg: this.props.addImgResponse.filename
          })
          clearInterval(addImgTimer)

        }
      }
    }, 10)
    
    event.target.reset()
  }

  // Добавление условия
  addFileCondition(event, index) {
    event.preventDefault()

    // Отправка файла на сервер 
    const formData = new FormData()
    formData.append('myFile', event.target.children[0].files[0])
    this.props.addImg('/api/addImg', formData)

    let addImgTimer = setInterval(() => {
      if (this.props.addImgResponse) {
        if (this.props.addImgResponse.filename !== this.state.prevImg) {
          // Добавление файла к определённому заданию
          let fileName = this.props.addImgResponse.filename
    
          // Добавим условия
          this.editInCategory(fileName, 'add-file-condition', index)

          this.setState({
            prevImg: this.props.addImgResponse.filename
          })
          clearInterval(addImgTimer)

        }
      }
    }, 10)
    
    event.target.reset()
  }

  activePopup(index, bool) {
    let activePopupsDel = this.state.activePopupsDel
    activePopupsDel[index] = bool
    this.setState({ activePopupsDel }) 
  }

  render() {
    
    function byField(field) {
      return (a, b) => a[field] > b[field] ? 1 : -1;
    }

    let subjects

    if (this.state.getTasksResponse) {
      subjects = this.state.getTasksResponse.tasks
      subjects.sort(byField('name'))
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

        contentPage.sort(byField('name'))
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
                <Popup
                  active = { this.state.activePopupsDel[index] }
                  title = { 'Удалить раздел ' + elem.name + '?' }
                  close = { () => { this.activePopup(index, false) }}
                >
                  <div className="popup__btn-group">
                    <button 
                      className="btn"  
                      onClick = { () => { 
                        this.editInCategory(index, 'remove') 
                        this.activePopup(index, false)
                      } }
                    > Да </button>
                    
                    <button 
                      className="btn" 
                      onClick = { () => { this.activePopup(index, false) } }
                    > Нет </button>
                  </div>

                </Popup>
                <button className="btn tasks__btn-category" onClick = { () => {this.navEdit({subject: this.state.navState.subject, categories: [elem.name]})} }>
                  { elem.name } 
                </button>

                <button className="tasks__btn-close" onClick = {() => { this.activePopup(index, true) }}>
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
                <Popup
                  active = { this.state.activePopupsDel[index] }
                  title = { 'Удалить раздел ' + elem.name + '?' }
                  close = { () => { this.activePopup(index, false) }}
                >
                  <div className="popup__btn-group">
                    <button 
                      className="btn"  
                      onClick = { () => { 
                        this.editInCategory(index, 'remove') 
                        this.activePopup(index, false)
                      } }
                    > Да </button>
                    
                    <button 
                      className="btn" 
                      onClick = { () => { this.activePopup(index, false) } }
                    > Нет </button>
                  </div>

                </Popup>

                <button className="btn tasks__btn-category" onClick = { () => {this.navEdit({subject: this.state.navState.subject, categories: [...this.state.navState.categories,elem.name]})} }>
                  { elem.name } 
                </button>

                <button className="tasks__btn-close" onClick = {() => { this.activePopup(index, true)}}>
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
            if (typeof elem['description'] === "undefined") {
              this.editInCategory('', 'edit-description', index)
            }

            if (typeof elem['conditionFile'] === "undefined") {
              this.editInCategory('', 'add-file-condition', index)
            }

            if (typeof elem['conditionText'] === "undefined") {
              this.editInCategory('', 'edit-text-condition', index)
            }

            let active = this.state.activePopupsDecision

            if (active.length < contentPage.length) {
              active[index] = []
              for (let j = 0; j < elem.img.length; j++) {
                active[index].push(false)
              }
            }

            let conditionFileInd
            if (elem.conditionFile) {
              conditionFileInd = -1
              for (let j = elem.conditionFile.length - 1; j !== 0; j--) {
                if (elem.conditionFile[j] === '.') {
                  conditionFileInd = j
                  break
                } 
              }
            }

            return (
              <div key = {index} className="task-card">
                <div className="task-card__header">
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

                </div>

                <span className="task-card__title"> Описание </span>
                <form 
                  className = 'form'
                  onSubmit = {(event) => {
                    event.preventDefault()
                    this.editInCategory(event.target[0].value, 'edit-description', index) 
                    event.target[0].value = ''
                  }}
                >
                  <input 
                    type="text"
                    placeholder = { elem.description }
                    className= 'input varisnt-form__input varisnt-form__input-description' 
                  />
                  <button className='varisnt-form__btn'/>
                </form>

                <span className="task-card__title"> Условие задачи </span>
                {
                  elem.conditionFile?
                  ['.png', '.jpg', '.jpeg', '.svg'].includes(elem.conditionFile.substring(conditionFileInd)) ? 
                  <div className="img-box">
                    <img 
                      key = {elem.conditionFile}
                      src = {'/uploads/' + elem.conditionFile} 
                      alt = 'Поменяь путь до файла в Taks.js'
                    />
                    <button className='btn-img-del' onClick = {() => { this.editInCategory('', 'remove-file-condition', index) }}/>
                  </div> : <div className="img-box">
                    <a href = {'/uploads/' + elem.conditionFile} target="_blank"> 
                      <img 
                        key = {elem.conditionFile}
                        src = {fileImg} 
                        alt = ''
                        className = 'img-box__file'
                      />
                      <span className = 'img-box__file-label'>{elem.conditionFile.substring(conditionFileInd)}</span>
                    </a>
                    
                    <button className='btn-img-del' onClick = {() => { this.editInCategory('', 'remove-file-condition', index) }}/>
                  </div> :
                  <form 
                    onSubmit = {(event) => {this.addFileCondition(event, index)}}
                    className = 'form-add-img'
                    encType = 'multipart/form-data'
                  >
                    <input 
                      className = 'add-img' 
                      type = 'file' 
                      name = 'myFile'
                    />
                    <button className='varisnt-form__btn'></button>
                  </form>
                }

                <form 
                  className = 'form'
                  onSubmit = {(event) => {
                    event.preventDefault()
                    this.editInCategory(event.target[0].value, 'edit-text-condition', index) 
                    event.target[0].value = ''
                  }}
                >
                  <input 
                    type="text"
                    placeholder = { elem.conditionText }
                    className= 'input varisnt-form__input varisnt-form__input-description' 
                  />
                  <button className='varisnt-form__btn'></button>
                </form>

                <span className="task-card__title"> Решения </span>
                {/* Решение */}
                <div className="task-card__imgs-box">
                  {
                    elem.img.map((img, i) => {

                      let ind = -1
                      for (let j = img.length - 1; j !== 0; j--) {
                        if (img[j] === '.') {
                          ind = j
                          break
                        } 
                      }

                      let activePopupsDecision = this.state.activePopupsDecision[index]

                      if (['.png', '.jpg', '.jpeg', '.svg'].includes(img.substring(ind))) {
                        return (
                          <div className="img-box">
                            <Popup
                              active = { activePopupsDecision[i] }
                              title = { 'Удалить решение?' }
                              close = { () => { 
                                let activePopupsDecision = this.state.activePopupsDecision
                                activePopupsDecision[index][i] = false
                                this.setState({ activePopupsDecision })
                              }}
                            >
                              <div className="popup__btn-group">
                                <button 
                                  className="btn"  
                                  onClick = { () => { 
                                    this.editInCategory('', 'img-remove', index, i) 

                                    let activePopupsDecision = this.state.activePopupsDecision
                                    activePopupsDecision[index][i] = false
                                    this.setState({ activePopupsDecision })
                                  } }
                                > Да </button>
                                
                                <button 
                                  className="btn" 
                                  onClick = { () => { 
                                    let activePopupsDecision = this.state.activePopupsDecision
                                    activePopupsDecision[index][i] = false
                                    this.setState({ activePopupsDecision })
                                  } }
                                > Нет </button>
                              </div>

                            </Popup>
                            <img 
                              key = {img}
                              src = {'/uploads/' + img} 
                              alt = 'Поменяь путь до файла в Taks.js'
                            />
                            <button className='btn-img-del' onClick = {() => {
                              let activePopupsDecision = this.state.activePopupsDecision
                              activePopupsDecision[index][i] = true
                              this.setState({ activePopupsDecision })
                            }}/>
                          </div>
                        )
                      } else {
                        return (
                          <div className="img-box">
                            <Popup
                              active = { activePopupsDecision[i] }
                              title = { 'Удалить решение?' }
                              close = { () => { 
                                let activePopupsDecision = this.state.activePopupsDecision
                                activePopupsDecision[index][i] = false
                                this.setState({ activePopupsDecision })
                              }}
                            >
                              <div className="popup__btn-group">
                                <button 
                                  className="btn"  
                                  onClick = { () => { 
                                    this.editInCategory('', 'img-remove', index, i) 

                                    let activePopupsDecision = this.state.activePopupsDecision
                                    activePopupsDecision[index][i] = false
                                    this.setState({ activePopupsDecision })
                                  } }
                                > Да </button>
                                
                                <button 
                                  className="btn" 
                                  onClick = { () => { 
                                    let activePopupsDecision = this.state.activePopupsDecision
                                    activePopupsDecision[index][i] = false
                                    this.setState({ activePopupsDecision })
                                  } }
                                > Нет </button>
                              </div>

                            </Popup>
                            
                            <a href = {'/uploads/' + img} target="_blank"> 
                              <img 
                                key = {img}
                                src = {fileImg} 
                                alt = ''
                                className = 'img-box__file'
                              />
                              <span className = 'img-box__file-label'>{img.substring(ind)}</span>
                            </a>
                            
                            <button className='btn-img-del' onClick = {() => {
                              let activePopupsDecision = this.state.activePopupsDecision
                              activePopupsDecision[index][i] = true
                              this.setState({ activePopupsDecision })
                            }}/>
                          </div>
                        )
                      }

                      
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