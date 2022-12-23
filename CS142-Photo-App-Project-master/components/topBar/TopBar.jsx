import React from 'react';
import {
  AppBar, Toolbar, Typography
} from '@material-ui/core';
import './TopBar.css';
import axios from 'axios';

/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      version: "",
      id: 0,
      userInfo: {},
      isLoggedIn: false,
      loggedInUserInfo: {},
    };
  }

  componentDidMount() {
    var schemaInfo = axios.get("/test/info");
    schemaInfo.then((response) => {
      var version = response.data.version;
      this.setState({version: version});
    }).catch((err) => {
      console.log(err);
    });
    var loggedInUserDetailModel = axios.get("/loginUser");
    loggedInUserDetailModel.then((response) => {
      var loggedInUserInfoModel = {
        _id: response.data._id,
        first_name: response.data.first_name,
        last_name: response.data.last_name
      };
      this.setState({
        loggedInUserInfo: loggedInUserInfoModel,
        isLoggedIn: true
      });
    }).catch((err) => {
      console.log(err);
    });
  }

  componentDidUpdate() {
    var id = this.getUserId();
    if (id !== undefined) {
      var userDetailModel = axios.get("/user/" + id);
      userDetailModel.then((response) => {
        if (id !== this.state.id) {
          var userInfoModel = {
            _id: response.data._id,
            first_name: response.data.first_name,
            last_name: response.data.last_name,
            location: response.data.location,
            description: response.data.description,
            occupation: response.data.occupation
          };
          this.setState({
            userInfo: userInfoModel,
            id: id
          });
        }
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  getUserId() {
    var currentURL = window.location.href;
    var userId;
    if (currentURL.includes("/users/")) {
      userId = currentURL.substring(currentURL.indexOf("/users/") + "/users/".length);
    } else if (currentURL.includes("/photos/")) {
      userId = currentURL.substring(currentURL.indexOf("/photos/") + "/photos/".length);
    }
    return userId;
  }

  createLoginStatus() {
    var retVal = [];
    if (this.state.isLoggedIn) {
      retVal.push("Hi, " + this.state.loggedInUserInfo.first_name + "  ");
      retVal.push(
        <a href="/photo-share.html#/addPhotos" className="addPhotoLink" key={1}>
          Add Photo
        </a>
      );
      retVal.push("  ");
      retVal.push(
        <a href="/photo-share.html#/favorites" className="favoritesLink" key={2}>
          Favorite Photos
        </a>
      );
      retVal.push("  ");
      retVal.push(
        <a href="#" onClick={(e) => this.handleLogout(e)} className="logoutLink" key={3}>
          Logout
        </a>
      );

    }
    return retVal;
  }

  createTitle() {
    var retVal = "";
    if (this.state.isLoggedIn) {
      var currentURL = window.location.href;
      var userObj;
      if (currentURL.includes("/users/")) {
        userObj = this.state.userInfo;
        if (userObj !== null) {
          retVal = userObj.first_name + " " + userObj.last_name;
        } else {
          retVal = "";
        }
      } else if (currentURL.includes("/photos/")) {
        userObj = this.state.userInfo;
        if (userObj !== null) {
          retVal = "Photos of " + userObj.first_name + " " + userObj.last_name;
        } else {
          retVal = "";
        }
      } else {
        retVal = "";
      }
    } else {
      retVal = "Please Login";
    }
    return retVal;
  }

  handleLogout(event) {
    if (this.state.isLoggedIn) {
      var logout = axios.post("/admin/logout", {});
      logout.then((response) => {
        console.log(response);
        window.location.assign("/photo-share.html#/login-register");
        window.location.reload();
        sessionStorage.clear();
        console.log('Session storage is clear!');
        this.setState({isLoggedIn: false});
      }).catch((err) => {
        console.log(err);
      });
    }
    event.preventDefault();
  }

  render() {
    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar>
          <Typography variant="h5" color="inherit" className="title">
            Ziyang Jiang (Photo App Version: {this.state.version})
          </Typography>
          <Typography variant="subtitle1" color="inherit" align="right" className="title">
            {this.createTitle()}
            <br/>
            <Typography variant="body2" color="inherit">
              {this.createLoginStatus()}
            </Typography>
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
