import React, { Component } from 'react'
import { connect } from "react-redux";
import { editUser } from "../actions/editUser";

class CustomerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startBalance: false
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
                return <div key={ index } className='customer-list__item'>
                  <div className="customer-list__item-email">
                    { value.email }
                  </div>

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