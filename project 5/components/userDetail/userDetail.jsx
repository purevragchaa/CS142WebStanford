import React from 'react';
import {
  Typography, Divider,
} from '@material-ui/core';
import { HashRouter, Link, Route, useParams } from 'react-router-dom';
import './userDetail.css';
import fetchModel from '../../lib/fetchModelData';

class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // users: window.cs142models.userListModel(),
      user: {}
    }
  }
  componentDidMount() {
    this.componentDidUpdate()
  }
    
  componentDidUpdate() {
    let userId = this.props.match.params.userId
    // Async call to server
    fetchModel(`http://localhost:3000/user/${userId}`)
      .then((data) => {
        console.log( "===================" );
        console.log( data );
        console.log( "===================" );
        this.setState({ user : data.data });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    // const index = window.cs142models.userModel(this.props.match.params.userId);
    // console.log( "===============>");
    // console.log( index );
    console.log(this.state.user);

    return (
      <div>
        <Typography variant="h5"> {this.state.user.first_name} {this.state.user.last_name}</Typography>
          <Typography variant="subtitle1"> 
            <b>Address: </b>
            {this.state.user.location} 
          </Typography>
          <Typography variant="body1">
            <b>Occupation: </b> 
            {this.state.user.occupation}
          </Typography>
          <Typography variant="body1">
            <b>Description: </b> 
            {this.state.user.description}
          </Typography>
          <Divider />
          <HashRouter>
            <Link to={`/photos/${this.state.user._id}`}>Photos</Link>
          </HashRouter>
      </div>
    );
  }
}

export default UserDetail;
