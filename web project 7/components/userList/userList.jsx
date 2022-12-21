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
import { HashRouter, Link, Router, withRouter } from 'react-router-dom';
import UserList2 from '../userlist2/userList2';
import fetchModel from '../../lib/fetchModelData.js';
import { useState } from 'react';
import { useEffect } from 'react';

/**
 * Define UserList, a React componment of CS142 project #5
 */


export default function UserList() {
  const [ users, setUsers] = useState( [] );

  useEffect(
    () => {
      const result = fetchModel('http://localhost:5000/user/list',setUsers);
      console.log( result );
      console.log( "user list" );
      console.log( users );
    }
    , [
    ]
  )

  return (
    <HashRouter>
      <div>
        <Typography variant="body1">
          Users
        </Typography>
          <List component="nav">
          {
            users !== undefined && users.map((element, index) =>(
              <UserList2 
                key = {index}
                element = { element }
              />
            ))
          }
          </List> 
      </div>
    </HashRouter>
  );
}

// class UserList extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       // users: window.cs142models.userListModel(),
//       users: [],
//     }
//     fetchModel('http://localhost:3000/user/list')
//       .then(
//         data => {
//           console.log( data )
//           this.state.users = data.data;
//         }
//       )
//     // console.log(this.state.users)   
//   }

//   render() {
//     console.log( this.state.users);
//     return (
//       <HashRouter>
//         <div>
//           <Typography variant="body1">
//             Users
//           </Typography>
//             <List component="nav">
//             {
//               this.state.users.map((element, index) =>(
//                 <UserList2 
//                 key = {index}
//                 element = { element }
//                 />
//               ))
//             }
//             </List> 
//         </div>
//       </HashRouter>
//     );
//   }
// }
