import React, {useState, useEffect} from 'react';
import {
  Typography, Divider,
} from '@material-ui/core';
import { HashRouter, Link, Route, useParams } from 'react-router-dom';
import './userDetail.css';
import fetchModel from '../../lib/fetchModelData';

const UserDetail = (props) => {
  // console.log( "ddddddddddddd " + props.match.params.userId );
  // console.log( props.match.params.userId);
  const [user, setUser] = useState( [] )
  useEffect(
    () => {
      let userId = props.match.params.userId
      const result = fetchModel(`http://localhost:5000/user/${userId}`, setUser)
      console.log( result );
      console.log( "user list" );
      console.log( user );
    }
    //yu oorchlogdvol dahiad duudah huvisgchaa ene massv hiij ogno
    , [
        props.match.params.userId
    ]
  )

  return (
    <div>
      <Typography variant="h5"> {user.first_name} {user.last_name}</Typography>
        <Typography variant="subtitle1"> 
          <b>Address: </b>
          {user.location} 
        </Typography>
        <Typography variant="body1">
          <b>Occupation: </b> 
          {user.occupation}
        </Typography>
        <Typography variant="body1">
          <b>Description: </b> 
          {user.description}
        </Typography>
        <Divider />
        <HashRouter>
          <Link to={`/photos/${user._id}`}>Photos</Link>
        </HashRouter>
    </div>
  );
}

export default UserDetail;
