import React, { Component } from 'react';

class Header extends Component {
  render() {
    return (
    <div>
		 <nav className="navbar navbar-expand-lg navbar-light mynav" style={{backgroundColor: "#fc4a1a", position: "fixed",height: "50px",borderRadius: "0"}}>
		 <a className="navbar-brand h3" style={{color: "#eeeeee" , fontWeight: "500px"}} href="#">Maze Problem</a>
		 
		 </nav>
	   
			
	</div>

  );
  }
}

export default Header;
