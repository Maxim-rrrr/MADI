import React, { Component } from 'react'

import { connect } from 'react-redux'
import { getTasks } from '../../actions/getTasks'
import { getCustomer } from '../../actions/getCustomer'
import { createPayment } from '../../actions/createPayment'
import { paymentFullBalance } from '../../actions/paymentFullBalance'

import TasksNav from './TasksNav'

import fileImg from '../../img/files.png'

class User extends Component {
  constructor(props) {
    super(props)
    this.state = {

      navState: {
        subject: null,
        categories: []
      },

      prise: 0,
      checkboxes: [],
      loadingPayment: false,
      numberPayment: 1,
      btnPriseHide: true, 
      fullImgs: []
    };

  }

  navEdit(navState) {
    this.setState({
      navState: navState
    })
  }

  checkboxesDefalt(len) {
    let arr = []
    for (let i = 0; i < len; i++) {
      arr.push(false)
    }
    this.setState({
      checkboxes: arr
    })
      
  }

  checkboxChange(index) {
    let arr = this.state.checkboxes

    arr[index] = !arr[index]

    this.setState({
      checkboxes: arr
    })
  }

  allСhoice() {
    let arr = this.state.checkboxes
    let bool = true
    arr.forEach(elem => {
      bool = bool && elem
    })

    if (!bool) {
      arr.forEach((elem, index) => {
        arr[index] = true
      })
    } else {
      arr.forEach((elem, index) => {
        arr[index] = false
      })
    }

    this.setState({
      checkboxes: arr
    })
  }

  payment() {
    if (localStorage.getItem('token')) {
      this.setState({
        loadingPayment: true
      })

      this.props.getCustomer('/api/getCustomer', {
        token: localStorage.getItem('token'),
        counter: this.state.numberPayment
      })

      let user_valid = setInterval(() => {
        if (this.props.getCustomerResponse !== '' && this.props.getCustomerResponse.status === 200 && this.props.getCustomerResponse.counter == this.state.numberPayment) {
          clearInterval(user_valid)

          let user = this.props.getCustomerResponse.customer
          localStorage.setItem(       'id', user._id      );
          localStorage.setItem(    'token', user.token    );
          localStorage.setItem(    'email', user.email    );
          localStorage.setItem( 'password', user.password );
          localStorage.setItem(  'balance', user.balance  );
          localStorage.setItem(   'orders', user.orders   );
          localStorage.setItem( 'inviting', user.inviting );

          let tasks = []
          this.state.checkboxes.forEach((value, index) => {
            if (value) {
              tasks.push(index + 1)
            }
          })

          if (+this.state.prise <= +user.balance && +this.state.prise !== 0) {
            this.props.paymentFullBalance('/api/paymentFullBalance', {
              numberPayment: this.state.numberPayment,
              prise: this.state.prise,
              token: user.token,
              subject: this.state.navState.subject,
              categories: this.state.navState.categories,
              tasks
            })

            let time = setInterval(() => {
              if (this.props.paymentFullBalanceResponse) {
                if (this.props.paymentFullBalanceResponse.numberPayment === this.state.numberPayment) {

                  this.setState({
                    loadingPayment: false,
                    numberPayment: this.state.numberPayment + 1
                  })

                  this.setState({
                    navState: {
                      subject: null,
                      categories: []
                    },
                  })

                  clearInterval(time)

                  this.props.userUpdata()
                }
              }

            })
            
          // } else if (+user.balance === 0) {
          //   console.log('user.balance === 0')
          //   this.props.createPayment('/api/createPayment', {
          //     prise: this.state.prise,
          //     info: {
          //       type: 1, // Прямая оплата товара
          //       token: user.token,
          //       email: user.email,
          //       subject: this.state.navState.subject,
          //       categories: this.state.navState.categories,
          //       tasks
          //     }
          //   })
  
          //   let payment = setInterval(() => {
          //     if (this.props.createPaymentResponse) {
          //       clearInterval(payment)
          //       this.setState({
          //         loadingPayment: false,
          //       });
          //       console.log(this.props.createPaymentResponse)
          //       window.location.href = this.props.createPaymentResponse.payment.confirmation.confirmation_url;
          //     }
          //   })
          } else if (+this.state.prise > +user.balance && +this.state.prise !== 0) {
            this.props.activeAddBalancePopup()
            this.setState({
              loadingPayment: false
            })
          } else {
            this.setState({
              loadingPayment: false
            })
          }
        }
      })
      
      
    } else {
      this.props.activeLoginPopup()
    }

  }

  componentDidMount() {
    this.props.getTasks('/api/getTasks')
    // setInterval(this.props.getTasks('/api/getTasks'), 10)

    setInterval(() => {
      if (this.state.navState.variant === null) {
        this.setState({
          checkboxes: []
        })
      }
    }, 10)
    
  }


  render() {
    
    let prise = 0, priseBtn = <></>
    
    // console.dir(widthContainer);

    let right = (document.documentElement.clientWidth - 1144) / 2 
    let w = this.state.loadingPayment?80:250
    
    if (document.documentElement.clientWidth <= 576) {
      right = (document.documentElement.clientWidth - w) / 2 
      
    } else if (document.documentElement.clientWidth <= 1200) {
      right = 20
    }

    function byField(field) {
      return (a, b) => a[field] > b[field] ? 1 : -1;
    }


    let subjects = []

    if (this.props.getTasksResponse) {
      this.props.getTasksResponse.tasks.forEach((subject) => {
        if (subject.public) {
          subjects.push(subject)
        }
      })

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
    let sign
    if (nav.subject) {
      if (nav.categories.length === 0) {       
        contentPage = subject.tasks
        
      } else {
        contentPage = subject.tasks
        nav.categories.forEach(item => {
          contentPage.forEach(task => {
            if (task.name === item) {
              contentPage = task.tasks
              sign = task.sign ? task.sign : ''
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
            subjects ? subjects.map((elem, index) => {
              return (
                <div className='tasks__btn-group animated fadeInUp' style = {{'animation-delay': `${index / 10}s`}} key = {elem.name}>
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
                <div className='tasks__btn-group animated fadeInUp' style = {{'animation-delay': `${index / 10}s`}} key = {elem.name}>
                  <button className="btn tasks__btn-category" onClick = { () => {this.navEdit({subject: this.state.navState.subject, categories: [elem.name]})} }>
                    { elem.name } 
                  </button>
                </div>
              )
            }) : '' 
          }
        </>
      // Категории
      } else if (nav.subject && nav.categories.length !== 0 && nav.categories.length < subject.model) {
        content = <>
          {
          sign ?
          <div className='sign animated fadeInUp' style = {{'animation-delay': `${contentPage.length / 10}s`}}>{sign}</div>: 
          <></>
          }
          {
            contentPage ? contentPage.map((elem, index) => {
              return (
                <div className='tasks__btn-group animated fadeInUp' style = {{'animation-delay': `${index / 10}s`}} key = {elem.name}>
                  <button className="btn tasks__btn-category" onClick = { () => {this.navEdit({subject: this.state.navState.subject, categories: [...this.state.navState.categories,elem.name]})} }>
                    { elem.name } 
                  </button>
                </div>
              )
            }) : ''
          }
          

        </>
      // Задания
      } else {
        

        if (this.state.checkboxes.length === 0) {
          this.checkboxesDefalt(contentPage.length)
        }

        this.state.checkboxes.forEach((checkbox, index) => {
          if (checkbox) {
            prise += +contentPage[index].prise
          }
        })

        if (this.state.prise !== prise) {
          this.setState({
            prise
          })
        }
        
        if (prise !== 0) {
          if (this.state.btnPriseHide) {
            this.setState({btnPriseHide: false})
          }
          
          priseBtn = 
            <button 
              onClick={() => {this.payment()}}
              className='btn btn-prise animated fadeInUp' 
              style={{right}}
            >
              Оплатить {prise} руб.
            </button>
        } else {
          if (!this.state.btnPriseHide) {
            priseBtn = 
              <button 
                onClick={() => {this.payment()}}
                className='btn btn-prise animated fadeOutDown' 
                style={{right}}
              >
                Оплатить {prise} руб.
              </button>
          }
        }

        if (this.state.loadingPayment) {
          priseBtn = 
            <div className="loader" style={{right}}>
              <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        }

        content = <>
            <button onClick={() => {this.allСhoice()}} className='btn btn-allСhoice'> Выбрать всё </button> 

            <form  className="task-user-form">
              {
                contentPage ? contentPage.map((elem, index) => {
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
                    <>
                      <div className={this.state.checkboxes[index] ? "task-user-form__section task-user-form__section--checked" : "task-user-form__section"} onClick={() => {this.checkboxChange(index)}}>
                        <div className="task-user-form__section-header">
                          <div className="checkbox animated fadeInRight" style = {{'animation-delay': `${index / 30}s`}} key={index}>
                            <label className={this.state.checkboxes[index] ? "checkbox__label checkbox__label--checked" : "checkbox__label"}>{ index + 1 }</label>
                          </div>

                          {
                            elem.conditionFile || elem.conditionText ?
                            <div className="condition">
                              <div className="condition__title"> Условие: </div>

                              {
                                elem.conditionText && 
                                <div className="condition__text">
                                  { elem.conditionText }
                                </div>
                              }

                              {
                                elem.conditionFile && 
                                <div className="condition__file">
                                  { 
                                    ['.png', '.jpg', '.jpeg', '.svg'].includes(elem.conditionFile.substring(conditionFileInd)) ? 
                                    <div 
                                      className = { this.state.fullImgs[index] ? "condition__img-box fullImg" : "condition__img-box"}
                                      
                                    >
                                      
                                      <img 
                                        key = {elem.conditionFile}
                                        src = {'/uploads/' + elem.conditionFile} 
                                        alt = ''
                                        onClick = {(event) => { 
                                          let fullImgs = this.state.fullImgs
  
                                          fullImgs[index] ? fullImgs[index] = false : fullImgs[index] = true
                                          
                                          this.setState({ fullImgs: fullImgs })
                                        }}
                                      />
                                      
                                    </div> : 
                                    <div className="">
                                      <a href = {'/uploads/' + elem.conditionFile} target="_blank"> 
                                        <img 
                                          key = {elem.conditionFile}
                                          src = {fileImg} 
                                          alt = ''
                                          className = 'img-box__file'
                                        />
                                      </a>
                                    </div>                                  
                                  }
                                </div>
                              }

                            </div>: ''
                          }
                        </div>
                        
                        {
                          elem.description && 
                          <div className = 'description'>
                            { elem.description }
                          </div>
                        }
                      </div>
                    </>
                  )
                }) : ''
              } 
            </form>

            { priseBtn }
        </>
      }

      return (
        <div className = 'tasks animated fadeIn'>
          <div className = 'container'>
            <TasksNav 
              navState = { this.state.navState }
              navEdit  = { (navState) => { this.navEdit(navState) } }
            />

            <div className="tasks__content">   
              { content } 
            </div>
            
            <div className="support" onClick={() => { this.props.activeSupportPopup() }}>?</div>
            <a href="./file/terms-use.pdf" className="terms-use"> Пользовательское соглашение </a>
          </div>
        </div>
      )

   
  }
}

const mapStateToProps = (state) => {
  return {
    getTasksResponse: state.getTasks,
    getCustomerResponse: state.getCustomer,
    createPaymentResponse: state.createPayment,
    paymentFullBalanceResponse: state.paymentFullBalance
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getTasks: (url) => dispatch(getTasks(url)),
    getCustomer: (url, data) => dispatch(getCustomer(url, data)),
    createPayment: (url, data) => dispatch(createPayment(url, data)),
    paymentFullBalance: (url, data) => dispatch(paymentFullBalance(url, data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(User);