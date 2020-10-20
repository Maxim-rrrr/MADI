import React, { Component } from 'react'

import { connect } from 'react-redux'
import { getTasks } from '../actions/getTasks'
import { getCustomer } from '../actions/getCustomer'
import { createPayment } from '../actions/createPayment'
import { paymentFullBalance } from '../actions/paymentFullBalance'

import TasksNav from './TasksNav'

class User extends Component {
  constructor(props) {
    super(props)
    this.state = {

      navState: {
        subject: null,
        work: null,
        variant: null,
        tasks: null
      },

      prise: 0,
      checkboxes: [],
      loadingPayment: false,
      numberPayment: 1
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
              work: this.state.navState.work,
              variant: this.state.navState.variant,
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
                      work: null,
                      variant: null,
                      tasks: null
                    },
                  })

                  clearInterval(time)

                  this.props.userUpdata()
                }
              }

            })
            
          } else if (+user.balance === 0) {
            this.props.createPayment('/api/createPayment', {
              prise: this.state.prise,
              info: {
                type: 1, // Прямая оплата товара
                email: localStorage.getItem('email'),
                subject: this.state.navState.subject,
                work: this.state.navState.work,
                variant: this.state.navState.variant,
                tasks
              }
            })
  
            let payment = setInterval(() => {
              if (this.props.createPaymentResponse) {
                clearInterval(payment)
                if (this.props.createPaymentResponse.confirmation) {
                  window.location.href = this.props.createPaymentResponse.confirmation.confirmation_url;
                } 
                this.setState({
                  loadingPayment: false,
                });
              }
            })
          } else if (+user.balance !== 0) {
            this.props.activeAddBalancePopap()
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
      this.props.activeLoginPopap()
    }

  }

  componentDidMount() {
    this.props.getTasks('/api/getTasks')
    setInterval(this.props.getTasks('/api/getTasks'), 10)

    setInterval(() => {
      if (this.state.navState.variant === null) {
        this.setState({
          checkboxes: []
        })
      }
    }, 10)
    
  }


  render() {
    
    let subject, works, variant, tasks, prise = 0, priseBtn = <></>

    let right = (document.documentElement.clientWidth - 1144) / 2 
    let w = this.state.loadingPayment?250:80
    
    if (document.documentElement.clientWidth <= 1200) {
      right = (document.documentElement.clientWidth - w) / 2 
    }

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

            if (this.state.checkboxes.length === 0) {
              this.checkboxesDefalt(tasks.length)
            }

            this.state.checkboxes.forEach((checkbox, index) => {
              if (checkbox) {
                prise += +tasks[index].prise
              }
            })

            if (this.state.prise !== prise) {
              this.setState({
                prise
              })
            }

            if (prise !== 0) {
              priseBtn = 
                <button 
                  onClick={() => {this.payment()}}
                  className='btn btn-prise' 
                  style={{right}}
                >
                  Оплатить {prise} руб.
                </button>
            } 

            if (this.state.loadingPayment) {
              priseBtn = 
                <div className="loader" style={{right}}>
                  <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
                </div>
            }
          } 
        })
      } 
      
    } 

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
                        </div>
                      )
                    }) : ''
                  }
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

                        </div>
                      )
                    }) : ''
                  }
                  
                </>: 

                // Варианты 
                this.state.navState.subject && this.state.navState.work && !this.state.navState.variant ? 
                <>

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
                  
                  <form  className="task-user-form">
                    {
                      tasks ? tasks.map((elem, index) => {
                        return (
                          <>
                            <div className="checkbox" key={index}>
                                <input onClick={() => {this.checkboxChange(index)}} checked={this.state.checkboxes[index]} className="checkbox__input" type="checkbox" id={"checkbox_" + index}/>
                                <label className="checkbox__label" htmlFor={"checkbox_" + index}>{ index + 1 }</label>
                            </div>
                          </>
                        )
                      }) : ''
                    } 
                  </form>

                  <button onClick={() => {this.allСhoice()}} className='btn btn-allСhoice'> Выбрать всё </button> 
                
                  { priseBtn }

                </>
              }
            </div>
            
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