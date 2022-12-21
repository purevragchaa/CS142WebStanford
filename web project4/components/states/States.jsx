import React from 'react';
import Header from '../Header/header';
import './States.css';

/**
 * Define States, a React componment of CS142 project #4 problem #2.  The model
 * data for this view (the state names) is available
 * at window.cs142models.statesModel().
 */
class States extends React.Component {
	constructor(props) {
    super(props);
    
	this.state = {
		regionName:"",
		dataArr:window.cs142models.statesModel()
	};
	this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		this.setState({ 
			regionName: event.target.value,
			dataArr:window.cs142models.statesModel().filter((element)=> {
				return element.toLowerCase().includes(event.target.value)
			}) 
		});
	}
	
	render(){
		const arrayLength = this.state.dataArr.length;
		const length = arrayLength > 0;
    	return (
    		<div>
				<Header />
				<label className="Input">Region Name: </label>
				<input 
					id="inputId" 
					type="text" 
					value={this.state.regionName}
					onChange={this.handleChange}
				/>
				{length ?
					<ul className = "regionName">
						{
							this.state.dataArr.map((element, index)=>
								<li key={index}>
									{element}
								</li>
							)
						}
					</ul>
					: <p className="hint"> Sorry, there is no region </p>
				}
			</div>
    	);
	}
}
export default States;
