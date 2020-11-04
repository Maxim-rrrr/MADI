import React, { Component } from 'react'
import { connect } from "react-redux";
import { editUser } from "../../../actions/editUser";

class CustomerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startBalance: false,
      activeItemList: [],
    }
  }

  handleSubmit(event) {
    const value = event.target.children[0].value

    if (value !== '') {
      this.props.editUser("/api/user-edit/" + event.target.id, {
        balance: value
      });
      event.target.children[0].value = ''
      this.props.customersUpdataDB()
    }
    
    event.preventDefault();
  }

  render() {
    if (this.props.tab === 'CustomerList') {
      return (
        <div className="customer-list animated fadeIn">
          <div className="container">
            { 
              
              this.props.customers.map((value, index) => {
                if (this.state.activeItemList.includes(index)) {
                  return (
                    <div key={ index } className='customer-list__item customer-list__item--active'>
                      <div className="customer-list__header">
                        <div className="customer-list__email">
                          { value.email }
                        </div>

                        <button 
                          className = "customer-list__btn-more customer-list__btn-more--active"
                          onClick = {() => {
                            let active = this.state.activeItemList
                            active.splice(active.indexOf(index), 1)

                            this.setState({
                              activeItemList: active
                            })
                          }}
                        />
                      </div>
                      
                      <div className="customer-list__body customer-list__body--active">

                        
                        <div className="customer-list__body-row">
                          <div>Баланс:</div>
                          <div className="customer-list__item-balance">
                            <form onSubmit = { (event) => { this.handleSubmit(event) } } className="customer-list__form" id = { value._id }>
                              <input 
                                type = "number" 
                                className = "input customer-list__input" 
                                placeholder = { this.props.balances[index] }
                              />
                              руб.
                              <button type='submit' className="customer-list__btn" />
                            </form>
                          </div>
                        </div>

                        <div className="customer-list__body-row">
                          <div>Сумма потраченных денег:</div>
                          <div>{value.summa} руб.</div>
                        </div>

                        <div className="customer-list__body-row">
                          <div>user_token:</div>
                          <div>{value.token}</div>
                        </div>
                        
                      </div>
  
                    </div>
                  )
                } else {
                  return (
                    <div key={ index } className='customer-list__item'>
                      <div 
                        className="customer-list__header"
                        onClick = {() => {
                          this.setState({
                            activeItemList: [...this.state.activeItemList, index]
                          })
                        }}
                      >
                        <div className="customer-list__email">
                          { value.email }
                        </div>

                        <button 
                          className = "customer-list__btn-more"
                          
                        />

                      </div>
                      <div className="customer-list__body">
                        <div className="customer-list__body-row">
                          <div>Баланс:</div>
                          <div className="customer-list__item-balance">
                            <form onSubmit = { (event) => { this.handleSubmit(event) } } className="customer-list__form" id = { value._id }>
                              <input 
                                type = "number" 
                                className = "input customer-list__input" 
                                placeholder = { this.props.balances[index] }
                              />
                              руб.
                              <button type='submit' className="customer-list__btn" />
                            </form>
                          </div>
                        </div>

                        <div className="customer-list__body-row">
                          <div>Сумма потраченных денег:</div>
                          <div>{value.summa} руб.</div>
                        </div>

                        <div className="customer-list__body-row">
                          <div>user_token:</div>
                          <div>{value.token}</div>
                        </div>
                      </div>  
                    </div>
                  )
                }

              }) 
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
    
  };
};

const mapDispatchToProps = dispatch => {
  return {
    editUser: (url, data) => dispatch(editUser(url, data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerList);