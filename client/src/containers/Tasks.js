import React, { Component } from 'react'
import { connect } from 'react-redux'

import { getTasks } from '../actions/getTasks'
import { addTask } from '../actions/addTask'
import { setTask } from '../actions/setTask'
import { removeTask } from '../actions/removeTask'
import { addImg } from '../actions/addImg'


import TasksNav from './TasksNav'

class Tasks extends Component {
  constructor(props) {
    super(props)
    this.state = {

      navState: {
        subject: null,
        work: null,
        variant: null,
        tasks: null
      },

      addSubjectInput: '',
      addWorkInput: '',
      prevImg: ''
    };

    this.changeAddSubjectInput = this.changeAddSubjectInput.bind(this);
    this.addSubject = this.addSubject.bind(this);
    this.changeAddWorkInput = this.changeAddWorkInput.bind(this);
    this.addWork = this.addWork.bind(this);
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
  
  // Subject формы добавления предмета
  addSubject(event) {
    event.preventDefault()

    if (this.state.addSubjectInput) {
      let tasks = this.props.getTasksResponse.tasks 
      let valid = true

      // Проверим нет ли уже предмета с таким названием
      tasks.forEach((value) => {
        if (value.name === this.state.addSubjectInput) {
          valid = false
        }
      })

      if (valid) {
        this.props.addTask('/api/addTask', {name: this.state.addSubjectInput})
      }

      this.props.getTasks('/api/getTasks')

      this.setState({
        addSubjectInput: ''
      })
    }
  }

  // Сhange input добавления предмета
  changeAddSubjectInput(event) {
    this.setState({
      addSubjectInput: event.target.value
    });
  }

  // Удаление предмета
  removeSubject(id) {
    this.props.removeTask(`/api/removeTask/${id}`)
    this.props.getTasks('/api/getTasks')
  }

  // Subject формы добавления работы
  addWork(event) {
    event.preventDefault()

    if (this.state.addWorkInput) {
      let tasks = this.props.getTasksResponse.tasks 
      let valid = true

      let subject = null

      // Вынесем нужный предмет в отдельную переменную
      tasks.forEach((value) => {
        if (value.name === this.state.navState.subject) {
          subject = value
        }
      })

      // Проверим нет ли уже работы с таким названием
      subject.works.forEach((value) => {
        if (value.name === this.state.addWorkInput) {
          valid = false
        }
      })

      // Добавление работы
      if (valid) {
        subject.works.push({
          "name": this.state.addWorkInput,
          "variant": []
        })

        this.props.setTask('/api/setTask/' + subject._id, {"works": subject.works})
      }

      this.props.getTasks('/api/getTasks')

      this.setState({
        addWorkInput: ''
      })
    }
  }

  // Сhange input добавления работы
  changeAddWorkInput(event) {
    this.setState({
      addWorkInput: event.target.value
    });
  }

  // Удаление предмета
  removeWork(workName) {
    let tasks = this.props.getTasksResponse.tasks 

    let subject = null

    // Вынесем нужный предмет в отдельную переменную
    tasks.forEach((value) => {
      if (value.name === this.state.navState.subject) {
        subject = value
      }
    })

    // Найдём и удалим нужную работу
    subject.works.forEach((value, index) => {
      if (value.name === workName) {
        subject.works.splice(index, index)
      }
    })

    this.props.setTask('/api/setTask/' + subject._id, {"works": subject.works})

    this.props.getTasks('/api/getTasks')
  }

  // Изменение количества вариантов 
  async setVariantCount(event) {
    event.preventDefault()

    const value = event.target.children[1].value
    event.target.children[1].value = ''

    let tasks = this.props.getTasksResponse.tasks 

    // Вынесем нужный предмет в отдельную переменную
    let subject

    await tasks.forEach((value) => {
      if (value.name === this.state.navState.subject) {
        subject = value
      }
    })

    // Добавим варианты
    subject.works.forEach((work, index) => {
      if (work.name === this.state.navState.work) {
        let variants = subject.works[index].variant

        if (value >= variants.length) {
          function add(value, length) {
            for (let i = 0; i < value - length; i++) {
              variants.push([])
            }
          }

          add(value, variants.length)
        } else {
          variants.splice(value)
        }

        subject.works[index].variant = variants
        
        
        this.props.setTask('/api/setTask/' + subject._id, {"works": subject.works})

        this.props.getTasks('/api/getTasks')
      }
    })
  }

  async setTasksCount(event) {
    event.preventDefault()

    const value = event.target.children[1].value // Значение из input
    event.target.children[1].value = ''

    let tasks = this.props.getTasksResponse.tasks 

    // Вынесем нужный предмет в отдельную переменную
    let subject

    await tasks.forEach((value) => {
      if (value.name === this.state.navState.subject) {
        subject = value
      }
    })

    // Изменим кол-во заданий
    subject.works.forEach((work, i) => {
      if (work.name === this.state.navState.work) {
        
        let tasks = subject.works[i].variant[this.state.navState.variant - 1]


        if (+value === 0) {
          tasks = []
        } else if (tasks.length > +value) {
          tasks = tasks.slice(0, value)
        } else {
          for (let j = value - tasks.length; j > 0; j--) {
            tasks.push({
              "prise" : 20,
              "img" : []
            })
          }
        }

        subject.works[i].variant[this.state.navState.variant - 1] = tasks

        this.props.setTask('/api/setTask/' + subject._id, {"works": subject.works})
      }
    })
  }

  // Изменение цены заданий
  setPrise(event, index) {
    event.preventDefault()
    const value = event.target.children[1].value
    if (+value >= 0) {
      event.target.children[1].value = ''
  
      let tasks = this.props.getTasksResponse.tasks 
  
      // Вынесем нужный предмет в отдельную переменную
      let subject
  
      tasks.forEach((value) => {
        if (value.name === this.state.navState.subject) {
          subject = value
        }
      })
  
      // Изменим цену
      subject.works.forEach((work, i) => {
        if (work.name === this.state.navState.work) {
          
          subject.works[i].variant[this.state.navState.variant - 1][index].prise = value
          
        }
      })

      this.props.setTask('/api/setTask/' + subject._id, {"works": subject.works})

    } 
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
          subject.works.forEach((work, i) => {
            if (work.name === this.state.navState.work) {
  
              subject.works[i].variant[this.state.navState.variant - 1][index].img.push(fileName)
              
            }
          })
  
          this.props.setTask('/api/setTask/' + subject._id, {"works": subject.works})
          this.setState({
            prevImg: this.props.addImgResponse.originalname
          })
          clearInterval(addImgTimer)

        }
      }
    }, 10)
    
    event.target.reset()
  }

  // Удаление решения 
  delImg(event, indexTask, indexImg) {
    event.preventDefault()

    let tasks = this.props.getTasksResponse.tasks 

    // Вынесем нужный предмет в отдельную переменную
    let subject

    tasks.forEach((value) => {
      if (value.name === this.state.navState.subject) {
        subject = value
      }
    })

    // Удаление решения
    subject.works.forEach((work, i) => {
      if (work.name === this.state.navState.work) {

        subject.works[i].variant[this.state.navState.variant - 1][indexTask].img.splice(indexImg, 1)
        
      }
    })

    this.props.setTask('/api/setTask/' + subject._id, {"works": subject.works})
  }


  render() {
    
    let subject, works, variant, tasks

    if (this.props.getTasksResponse) {
      subject = this.props.getTasksResponse.tasks

      subject.forEach(element => {
        if (element.name === this.state.navState.subject) {
          works = element.works
        }
      });

      if (works) {
        works.forEach(element => {
          if (element.name === this.state.navState.work) {
            variant = element.variant
          } 
        })
      }
      
      if (variant) {
        variant.forEach((element, index) => {
          if (index === this.state.navState.variant - 1) {
            tasks = element
          } 
        })
      }
    } 

    if (this.props.tab === 'Tasks') {
      return (
        <div className = 'tasks animated fadeIn'>
          <div className = 'container'>
            <TasksNav 
              navState = { this.state.navState }
              navEdit  = { (navState) => { this.navEdit(navState) } }
            />

            <div className="tasks__content">
              { 
                // Предметы
                !this.state.navState.subject && !this.state.navState.work ? 
                <> 
                  { 
                    subject ? subject.map(elem => {
                      return (
                        <div className='tasks__btn-group' key = {elem.name}>
                          <button className="btn tasks__btn-category"  onClick = { () => {this.navEdit({subject: elem.name, work: null})} }>
                            { elem.name } 
                          </button>
                          <button className="tasks__btn-close" onClick = {() => { this.removeSubject(elem._id) }}>
                            <img src="./img/close.png" alt=""/> 
                          </button>
                        </div>
                      )
                    }) : ''
                  }

                  <form onSubmit = { (event) => { this.addSubject(event) } } className="tasks__form">
                    <input 
                      type = 'text' 
                      className = 'input tasks__input' 
                      placeholder = 'Добавить предмет'
                      value = { this.state.addSubjectInput }
                      onChange={ this.changeAddSubjectInput } 
                    />
                    <button type='submit' className="tasks__btn-submit" />
                  </form>

                </>:

                // Работы
                this.state.navState.subject && !this.state.navState.work ? 
                <> 
                  {
                    works ? works.map(elem => {
                      return (
                        <div className='tasks__btn-group' key = {elem.name}>
                          <button className="btn tasks__btn-category" onClick = { () => {this.navEdit({subject: this.state.navState.subject, work: elem.name})} }>
                            { elem.name } 
                          </button>

                          <button className="tasks__btn-close" onClick = {() => { this.removeWork(elem.name) }}>
                            <img src="./img/close.png" alt=""/> 
                          </button>
                        </div>
                      )
                    }) : ''
                  }

                  <form onSubmit = { (event) => { this.addWork(event) } } className="tasks__form">
                    <input 
                      type = 'text' 
                      className = 'input tasks__input' 
                      placeholder = 'Добавить работу'
                      value = { this.state.addWorkInput }
                      onChange={ this.changeAddWorkInput } 
                    />
                    <button type='submit' className="customer-list__btn" />
                  </form>
                  
                </>: 

                // Варианты 
                this.state.navState.subject && this.state.navState.work && !this.state.navState.variant ? 
                <>
                  
                  <form onSubmit = { (event) => { this.setVariantCount(event) } } className="varisnt-form" >
                    <span className="varisnt-form__label"> Вариантов </span>

                    <input 
                      type="number" 
                      className="input varisnt-form__input" 
                      placeholder={ variant.length }
                    />

                    <button type='submit' className="varisnt-form__btn" />
                  </form>

                  {
                    variant ? variant.map((elem, index) => {
                      return (
                        <button 
                          key = {index} 
                          onClick = {() => {
                            this.navEdit({
                              subject: this.state.navState.subject, 
                              work: this.state.navState.work, 
                              variant: index + 1
                            })
                          }}
                          className='btn btn-variant'
                        >
                          Вариант { index + 1 } 
                        </button>
                      )
                    }) : ''
                  } 

                </>:

                // Задания
                <>
                  {/* Изменение кол-во заданий */}
                  <form onSubmit = { (event) => { this.setTasksCount(event) } } className="varisnt-form" >
                    <span className="varisnt-form__label"> Заданий </span>

                    <input 
                      type="number" 
                      className="input varisnt-form__input" 
                      placeholder={ tasks.length }
                    />

                    <button type='submit' className="varisnt-form__btn" />
                  </form>

                  {
                    tasks ? tasks.map((elem, index) => {
                      return (
                        <>
                            
                          <div key = {index} className="task-card">

                            <span className="task-card__title"> Задание { index + 1 } </span>

                            {/* Изменение цены заданий */}
                            <form onSubmit = { (event) => { this.setPrise(event, index) } }  className="prise-form">
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
                                      <button className='btn-img-del' onClick = {(event) => {this.delImg(event, index, i)}}/>
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
                        </>
                      )
                    }) : ''
                  } 
                </>
              }
            </div>
            
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
    addTaskResponse: state.addTask,
    setTaskResponse: state.setTask,
    removeTaskResponse: state.removeTask,
    addImgResponse: state.addImg,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getTasks: (url) => dispatch(getTasks(url)),
    addTask: (url, name) => dispatch(addTask(url, name)),
    setTask: (url, data) => dispatch(setTask(url, data)),
    removeTask: (url) => dispatch(removeTask(url)),
    addImg: (url, imgData) => dispatch(addImg(url, imgData))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);