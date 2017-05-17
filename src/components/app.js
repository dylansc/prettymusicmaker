import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React from 'react';
import FallBack from './fallback';
// import Nav from './nav';
import Splash from './splash';
import Column from './column';
import Profile from './profile';

const App = (props) => {
  return (
    <Router>
      <div className="navParent">
        <Switch>
          <Route exact path="/" component={Splash} />
          <Route path="/editor" component={Column} />
          <Route path="/profile" component={Profile} />
          <Route component={FallBack} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
