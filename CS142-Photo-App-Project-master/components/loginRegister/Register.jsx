import React from 'react';
import './Register.css';
import axios from 'axios';

/**
 * Define Register View, a React componment of CS142 project #7
 */
 class Register extends React.Component {
   constructor(props) {
     super(props);
     this.handleChangeBound1 = event => this.handleChangeUsername(event);
     this.handleChangeBound2 = event => this.handleChangeFirstName(event);
     this.handleChangeBound3 = event => this.handleChangeLastName(event);
     this.handleChangeBound4 = event => this.handleChangeLocation(event);
     this.handleChangeBound5 = event => this.handleChangeDescription(event);
     this.handleChangeBound6 = event => this.handleChangeOccupation(event);
     this.handleChangeBound7 = event => this.handleChangePassword(event);
     this.handleChangeBound8 = event => this.handleChangeConfirmedPassword(event);
     this.handleSubmit = this.handleSubmit.bind(this);
     this.state = {
       username: "",
       firstName: "",
       lastName: "",
       location: "",
       description: "",
       occupation: "",
       password: "",
       confirmedPassword: "",
       isUsernameEmpty: false,
       isUsernameWrong: false,
       isFirstNameEmpty: false,
       isLastNameEmpty: false,
       isLocationEmpty: false,
       isDescriptionEmpty: false,
       isOccupationEmpty: false,
       isPasswordEmpty: false,
       isConfirmedPasswordEmpty: false,
       isPasswordDifferent: false,
       isRegistered: false,
       existingUsernames: []
     };
   }

   checkInputForm() {
     let errorCount = 0;
     if (this.state.username.length === 0 || this.state.username === null) {
       this.setState({
         isUsernameEmpty: true,
         isUsernameWrong: false
       });
       errorCount++;
     } else {
       this.setState({
         isUsernameEmpty: false,
         isUsernameWrong: false
       });
     }
     if (this.state.firstName.length === 0 || this.state.firstName === null) {
       this.setState({isFirstNameEmpty: true});
       errorCount++;
     } else {
       this.setState({isFirstNameEmpty: false});
     }
     if (this.state.lastName.length === 0 || this.state.lastName === null) {
       this.setState({isLastNameEmpty: true});
       errorCount++;
     } else {
       this.setState({isLastNameEmpty: false});
     }
     if (this.state.location.length === 0 || this.state.location === null) {
       this.setState({isLocationEmpty: true});
       errorCount++;
     } else {
       this.setState({isLocationEmpty: false});
     }
     if (this.state.description.length === 0 || this.state.description === null) {
       this.setState({isDescriptionEmpty: true});
       errorCount++;
     } else {
       this.setState({isDescriptionEmpty: false});
     }
     if (this.state.occupation.length === 0 || this.state.occupation === null) {
       this.setState({isOccupationEmpty: true});
       errorCount++;
     } else {
       this.setState({isOccupationEmpty: false});
     }
     if (this.state.password.length === 0 || this.state.password === null) {
       this.setState({isPasswordEmpty: true});
       errorCount++;
     } else {
       this.setState({isPasswordEmpty: false});
     }
     if (this.state.confirmedPassword.length === 0 || this.state.confirmedPassword === null) {
       this.setState({
         isConfirmedPasswordEmpty: true,
         isPasswordDifferent: false
       });
       errorCount++;
     } else {
       if (this.state.password !== this.state.confirmedPassword) {
         this.setState({
           isConfirmedPasswordEmpty: false,
           isPasswordDifferent: true
         });
         errorCount++;
       } else {
         this.setState({
           isConfirmedPasswordEmpty: false,
           isPasswordDifferent: false
         });
       }
     }

     if (errorCount === 0) {
       return true;
     } else {
       return false;
     }
   }

   handleChangeUsername(event) {
     // handleChangeBound1
     this.setState({username: event.target.value});
   }

   handleChangeFirstName(event) {
     // handleChangeBound2
     this.setState({firstName: event.target.value});
   }

   handleChangeLastName(event) {
     // handleChangeBound3
     this.setState({lastName: event.target.value});
   }

   handleChangeLocation(event) {
     // handleChangeBound4
     this.setState({location: event.target.value});
   }

   handleChangeDescription(event) {
     // handleChangeBound5
     this.setState({description: event.target.value});
   }

   handleChangeOccupation(event) {
     // handleChangeBound6
     this.setState({occupation: event.target.value});
   }

   handleChangePassword(event) {
     // handleChangeBound7
     this.setState({password: event.target.value});
   }

   handleChangeConfirmedPassword(event) {
     // handleChangeBound8
     this.setState({confirmedPassword: event.target.value});
   }

   showEmptyMessageForUsername() {
     if (this.state.isUsernameEmpty === true) {
       var emptyMessageForUsername = (
         <span style={{color: "red"}}>
           **Username cannot be empty. Please try again.**
         </span>
       );
       return emptyMessageForUsername;
     }
     return;
   }

   showEmptyMessageForFirstName() {
     if (this.state.isFirstNameEmpty === true) {
       var emptyMessageForFirstName = (
         <span style={{color: "red"}}>
           **First name cannot be empty. Please try again.**
         </span>
       );
       return emptyMessageForFirstName;
     }
     return;
   }

   showEmptyMessageForLastName() {
     if (this.state.isLastNameEmpty === true) {
       var emptyMessageForLastName = (
         <span style={{color: "red"}}>
           **Last name cannot be empty. Please try again.**
         </span>
       );
       return emptyMessageForLastName;
     }
     return;
   }

   showEmptyMessageForLocation() {
     if (this.state.isLocationEmpty === true) {
       var emptyMessageForLocation = (
         <span style={{color: "red"}}>
           **Location cannot be empty. Please try again.**
         </span>
       );
       return emptyMessageForLocation;
     }
     return;
   }

   showEmptyMessageForDescription() {
     if (this.state.isDescriptionEmpty === true) {
       var emptyMessageForDescription = (
         <span style={{color: "red"}}>
           **Description cannot be empty. Please try again.**
         </span>
       );
       return emptyMessageForDescription;
     }
     return;
   }

   showEmptyMessageForOccupation() {
     if (this.state.isOccupationEmpty === true) {
       var emptyMessageForOccupation = (
         <span style={{color: "red"}}>
           **Occupation cannot be empty. Please try again.**
         </span>
       );
       return emptyMessageForOccupation;
     }
     return;
   }

   showEmptyMessageForPassword() {
     if (this.state.isPasswordEmpty === true) {
       var emptyMessageForPassword = (
         <span style={{color: "red"}}>
           **Password cannot be empty. Please try again.**
         </span>
       );
       return emptyMessageForPassword;
     }
     return;
   }

   showEmptyMessageForConfirmedPassword() {
     if (this.state.isConfirmedPasswordEmpty === true) {
       var emptyMessageForConfirmedPassword = (
         <span style={{color: "red"}}>
           **Confirmed password cannot be empty. Please try again.**
         </span>
       );
       return emptyMessageForConfirmedPassword;
     }
     return;
   }

   showErrorMessageForPassword() {
     if (this.state.isPasswordDifferent === true) {
       var errorMessageForPassword = (
         <span style={{color: "red"}}>
           **Password and confirmed password must be the same. Please try again.**
         </span>
       );
       return errorMessageForPassword;
     }
     return;
   }

   showErrorMessageForUsername() {
     if (this.state.isUsernameWrong === true) {
       var errorMessageForUsername = (
         <span style={{color: "red"}}>
           **Username already exists. Please try a new one.**
           <br/>
         </span>
       );
       return errorMessageForUsername;
     }
     return;
   }

   showCorrectMessage() {
     if (this.state.isRegistered === true) {
       var correctMessage = (
         <span style={{color: "blue"}}>
           **User registered successfully. Please go back to the login page.**
           <br/>
         </span>
       );
       return correctMessage;
     }
     return;
   }

   handleSubmit(event) {
     event.preventDefault();
     this.setState({isRegistered: false});
     var isFormValid = this.checkInputForm();
     if (isFormValid) {
       var registeredUserObj = {
         login_name: this.state.username,
         first_name: this.state.firstName,
         last_name: this.state.lastName,
         location: this.state.location,
         description: this.state.description,
         occupation: this.state.occupation,
         password: this.state.password
       };
       axios.post("/user", registeredUserObj).then((res) => {
         this.setState({isRegistered: true});
         document.getElementById('myUsername').value = '';
         document.getElementById('myFirstName').value = '';
         document.getElementById('myLastName').value = '';
         document.getElementById('myLocation').value = '';
         document.getElementById('myDescription').value = '';
         document.getElementById('myOccupation').value = '';
         document.getElementById('myPassword').value = '';
         document.getElementById('myConfirmedPassword').value = '';
         this.render();
         console.log(res.data);
       }).catch((err) => {
         this.setState({
           isUsernameEmpty: false,
           isUsernameWrong: true,
           isRegistered: false
         });
         this.render();
         console.log(err);
       });
     }
     this.render();
   }

   backToLogin(event) {
     window.location.assign("/photo-share.html#/login-register");
     event.preventDefault();
   }

   render() {
     return (
       <form onSubmit={this.handleSubmit}>
         <h3>
           Please enter the required information below to register as a new user.
           <br/>
         </h3>
         <label>
           Note:
           <i>
             Please make sure that your password and confirmed password are identical.
           </i>
         <br/>
         {this.showErrorMessageForUsername()}
         {this.showCorrectMessage()}
         {}
         <br/>
         </label>
         <label>Username: </label>
         <input type="text" onChange={this.handleChangeBound1} id="myUsername" />
         {this.showEmptyMessageForUsername()}
         <br/>
         <br/>
         <label>First Name: </label>
         <input type="text" onChange={this.handleChangeBound2} id="myFirstName" />
         {this.showEmptyMessageForFirstName()}
         <br/>
         <br/>
         <label>Last Name: </label>
         <input type="text" onChange={this.handleChangeBound3} id="myLastName" />
         {this.showEmptyMessageForLastName()}
         <br/>
         <br/>
         <label>Location: </label>
         <input type="text" onChange={this.handleChangeBound4} id="myLocation" />
         {this.showEmptyMessageForLocation()}
         <br/>
         <br/>
         <label>Description: </label>
         <input type="text" onChange={this.handleChangeBound5} id="myDescription" />
         {this.showEmptyMessageForDescription()}
         <br/>
         <br/>
         <label>Occupation: </label>
         <input type="text" onChange={this.handleChangeBound6} id="myOccupation" />
         {this.showEmptyMessageForOccupation()}
         <br/>
         <br/>
         <label>Password: </label>
         <input type="password" onChange={this.handleChangeBound7} id="myPassword" />
         {this.showEmptyMessageForPassword()}
         <br/>
         <br/>
         <label>Confirmed Password: </label>
         <input type="password" onChange={this.handleChangeBound8} id="myConfirmedPassword" />
         {this.showEmptyMessageForConfirmedPassword()}
         {this.showErrorMessageForPassword()}
         <br/>
         <br/>
         <input type="submit" value="Register Me" />
         <span>    </span>
         <button type="button" onClick={(e) => this.backToLogin(e)}>
           Back to Login
         </button>
       </form>
     );
   }
 }

export default Register;
