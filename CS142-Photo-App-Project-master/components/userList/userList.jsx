import React from 'react';
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
}
from '@material-ui/core';
import './userList.css';
import axios from 'axios';

/**
 * Define UserList, a React componment of CS142 project #5
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usersArr: [],
      isLoggedIn: false,
    };
  }

  componentDidMount() {
    var userModel = axios.get("/user/list");
    userModel.then((response) => {
      this.setState({usersArr: response.data, isLoggedIn: true});
    }).catch((err) => {
      this.setState({isLoggedIn: false});
      console.log(err);
    });
  }

  displayUsernames() {
    if (this.state.isLoggedIn) {
      var userNamesList = [];
      var userNamesArr = [];
      for (var i = 0; i < this.state.usersArr.length; i++) {
        userNamesArr.push(this.state.usersArr[i].first_name + ' ' + this.state.usersArr[i].last_name);
      }
      for (i = 0; i < userNamesArr.length; i++) {
        var link = "http://localhost:3000/photo-share.html#/users/" + this.state.usersArr[i]._id;
        userNamesList.push(<ListItem key={2*i} component="a" href={link}>
          <ListItemText primary={userNamesArr[i]} />
        </ListItem>);
        userNamesList.push(<Divider key={2*i+1}/>);
      }
      var retVal = (
        <div>
          <Typography variant="body1">
            To see the details of a specificed user, please click the username from the list below:
          </Typography>
          <List component="nav">
            {userNamesList}
          </List>
        </div>
      );
    } else {
      retVal = (
        <Typography variant="body1">
          Please log in to see the full user list.
        </Typography>
      );
    }
    return retVal;
  }

  render() {
    return (
      <div>
        {this.displayUsernames()}
      </div>
    );
  }
}
export default UserList;
