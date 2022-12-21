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
      setUsers( window.cs142models.userListModel() )
      fetchModel('http://localhost:3000/user/list')
        .then(
          data => {
            console.log( data )
            setUsers(data.data)
          }
        )
    }
    , [

    ]
  )
  console.log( users);
  return (
    <HashRouter>
      <div>
        <Typography variant="body1">
          Users
        </Typography>
          <List component="nav">
          {
            users.map((element, index) =>(
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
//     this.state = { users : [], };
//   }

//   componentDidMount() {
//     // Async call to server
//     fetchModel('http://localhost:3000/user/list')
//       .then((response) => {
//         let users = response['data'];
//         this.setState({ users : users });
//       })
//       .catch((e) => {
//         console.log(e);
//       });
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
// export default UserList;