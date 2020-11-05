import React, { Component } from 'react';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'


import Admin from './Admin/index';
import User from './User/index'


export default class App extends Component {
  
  render() {
    return (
        <Router>
          <Switch>

            <Route exact path='/' component = { User } />

            <Route exact path='/admin' component={ Admin } />

          </Switch>
        </Router>
    );
  }
}


