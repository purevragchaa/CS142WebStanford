import React from 'react';
import './LoginRegister.css';
import axios from 'axios';

/**
 * Define Login View, a React componment of CS142 project #7
 * Note: The password for all default users is "weak"
 */
 class LoginRegister extends React.Component {
   constructor(props) {
     super(props);
     this.handleChangeBound1 = event => this.handleChangeUsername(event);
     this.handleChangeBound2 = event => this.handleChangePassword(event);
     this.state = {
       loginName: "",
       password: "",
       isLoginNameEmpty: false,
       isPasswordEmpty: false,
       isLoginNameOrPasswordWrong: false
     };
   }

   handleLogin(event) {
     if (this.state.loginName !== "") {
       if (this.state.password !== "") {
         var login = axios.post("/admin/login", {
           login_name: this.state.loginName,
           password: this.state.password
         });
         login.then((response) => {
           console.log('Login success!');
           let userDetailLink = "/photo-share.html#/users/" + response.data._id;
           this.setState({
             isLoginNameEmpty: false,
             isPasswordEmpty: false,
             isLoginNameOrPasswordWrong: false
           });
           sessionStorage.setItem('isLoggedIn', true);
           window.location.reload();
           window.location.assign(userDetailLink);

         }).catch((err) => {
           console.log(err);
           this.setState({
             isLoginNameEmpty: false,
             isPasswordEmpty: false,
             isLoginNameOrPasswordWrong: true
           });
         });
       } else {
         this.setState({
           isLoginNameEmpty: false,
           isPasswordEmpty: true,
           isLoginNameOrPasswordWrong: false
         });
       }
     } else {
       this.setState({
         isLoginNameEmpty: true,
         isPasswordEmpty: false,
         isLoginNameOrPasswordWrong: false
       });
     }
     this.render();
     event.preventDefault();
   }

   handleRegister(event) {
     window.location.assign("/photo-share.html#/register");
     event.preventDefault();
   }

   handleChangeUsername(event) {
     this.setState({loginName: event.target.value});
   }

   handleChangePassword(event) {
     this.setState({password: event.target.value});
   }

   showEmptyMessageForLoginName() {
     if (this.state.isLoginNameEmpty === true) {
       var emptyMessageForLoginName = (
         <span style={{color: "red"}}>
           Username cannot be empty. Please try again.
           <br/>
         </span>
       );
       return emptyMessageForLoginName;
     }
     return;
   }

   showEmptyMessageForPassword() {
     if (this.state.isPasswordEmpty === true) {
       var emptyMessageForPassword = (
         <span style={{color: "red"}}>
           Password cannot be empty. Please try again.
           <br/>
         </span>
       );
       return emptyMessageForPassword;
     }
     return;
   }

   showErrorMessage() {
     if (this.state.isLoginNameOrPasswordWrong === true) {
       var errorMessage = (
         <span style={{color: "red"}}>
           Username or password is not correct. Please try again.
           <br/>
         </span>
       );
       return errorMessage;
     }
     return;
   }

   render() {
     return (
       <div>
          <h3>
            Please log in with your username and password.
            <br/>
          </h3>
          If you do not have an account, please register as a new user.
          <br/>
          <br/>
          <label>Username: </label>
          <input type="text" onChange={this.handleChangeBound1} />
          <br/>
          <br/>
          <label>Password:  </label>
          <input type="password" onChange={this.handleChangeBound2} />
          <br/>
          {this.showEmptyMessageForLoginName()}
          {this.showEmptyMessageForPassword()}
          {this.showErrorMessage()}
          <br/>
          <button type="button" onClick={(e) => this.handleLogin(e)}>Login</button>
          <span>    </span>
          <button type="button" onClick={(e) => this.handleRegister(e)}>Register</button>
       </div>
     );
   }
 }

export default LoginRegister;
