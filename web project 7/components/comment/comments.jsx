import React, {useState, useEffect} from 'react'
import {
    List,
    ListItem,
  } from '@material-ui/core';
import fetchModel from '../../lib/fetchModelData';
import { HashRouter, Link, Router } from 'react-router-dom';
export default function Comments( props ) {
    console.log( props );
    const [ user, setUser] = useState( [] );
    useEffect(
        () => {
            let userId = props.el.user_id
            const result = fetchModel(`http://localhost:5000/user/${userId}`, setUser)
            console.log( result );
            console.log( "user list comment" );
            console.log( user );
        }
        , [

        ]
    )
    return (
        <List>
            <Link to={`/users/${props.el.user_id}`}>   
                {user.first_name} 
            </Link> 
            <ListItem>                                           
                { props.el.comment}
            </ListItem> 
            <ListItem>{props.el.date_time}</ListItem>
        </List>
    )
}
