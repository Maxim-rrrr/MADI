import React, { Component } from 'react';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'


import Admin from './Admin/index';
import User from './User/index'
import invite from './Invite/index'
import ErrorPage from './ErrorPage/index'


export default class App extends Component {
  
  render() {
    return (
      <>
        <Router>
          <Switch>

            <Route exact path='/' component = { User } />

            <Route exact path='/admin' component={ Admin } />

            <Route exact path='/invite/:inviteToken' component={ invite } />

            <Route path="*">
              <ErrorPage 
                code = '404'
                message = 'Страница не найдена'
              />
            </Route>

          </Switch>
        </Router>

        <div className="version-label"> 0.1.1 </div>
      </>
    );
  }
}


