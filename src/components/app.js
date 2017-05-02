import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React from 'react';
import FallBack from './fallback';
import PostBoard from './posts';
import NewPost from './newpost';
import PostTile from './postTile';
import Nav from './nav';


const App = (props) => {
  return (
    <Router>
      <div className="navParent">
        <Nav />
        <Switch>
          <Route exact path="/" component={PostBoard} />
          <Route path="/posts/new" component={NewPost} />
          <Route path="/post/:postID" component={PostTile} />
          <Route component={FallBack} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
