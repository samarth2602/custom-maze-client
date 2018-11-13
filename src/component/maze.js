import React, { Component } from 'react';
import './maze.css';
import Header from './header'
import Mazecontainer from './mazecontainer'
import Mazecontainer_1 from './mazeContainer_1'
class Maze extends Component {
  constructor(props)
  {
    super(props);
    this.state={height: "",width: "",map: ""}
  }
  
  render() {
    return (
      <div className="">
      
          <Header />
      
        <Mazecontainer_1 /> 
      </div>
    );
  }
}

export default Maze;
