import React from 'react';
import './header.css'
/**
 * Define States, a React componment of CS142 project #4 problem #2.  The model
 * data for this view (the state names) is available
 * at window.cs142models.statesModel().
 */
class Header extends React.Component {
	constructor(props) {
    	super(props);
  	}

  	render() { 
    	return (
      		<div className="header">
				<div className="pr"><a href="getting-started.html"><p>Problem 1</p></a></div>
				<div className="pr"><a href="p2.html"><p>Problem 2</p></a></div>
				<div className="pr"><a href="p3.html"><p>Problem 3</p></a></div>
				<div className="pr"><a href="p4.html"><p>Problem 4</p></a></div>
				<div className="pr"><a href="p5.html"><p>Problem 5</p></a></div>
			</div>
		);
	}
}

export default Header;
