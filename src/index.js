import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import maze from './component/maze'
import { Router,Route,browserHistory,IndexRoute } from "react-router"
import registerServiceWorker from './registerServiceWorker';
import Mazecontainer from './component/mazecontainer';
import Mazecontainer_1 from './component/mazeContainer_1';

class Root extends Component {
    render() {
      return (
       <Router history={browserHistory}>
            <Route path="/" component={maze}>
            <Route path="maze-problem" component={Mazecontainer}/>
            <IndexRoute component={Mazecontainer_1}/>
            </Route>
      </Router>
      );
    }
  }
ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
