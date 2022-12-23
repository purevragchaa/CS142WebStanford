import React, { useState } from 'react';
import Example from '../example/Example';
import States from '../states/States';
import './switch.css';

class Switch extends React.Component {
	
	constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
		this.state = {
			html: <div><States /></div>,
			tabName: "States"
		}
		// console.log(this.state.tabName);
    }
	
    handleClick(){
		if(this.state.tabName === "States"){
			this.setState({ html: <div><Example/></div> });
			this.setState({ tabName: "Example" })
			// console.log(this.state.tabName);
		}else{
			this.setState({ html: <div><States/></div> });
			this.setState({ tabName: "States" });
			console.log(this.tabName);
		}
    };

	render(){
    	return (
    		<div>
				{this.state.html}
    	    	<button onClick={() => this.handleClick()}>Switch to Example</button>
			</div>	
    	);
	}
}

export default Switch;