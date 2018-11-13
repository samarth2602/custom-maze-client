import React from 'react';
import ReactDOM from 'react-dom';
import Maze from './component/maze';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Maze />, document.getElementById('root'));
registerServiceWorker();
