import React, { Component } from 'react'
import {
    Divider,
    List,
    ListItem,
    ListItemText,
    Typography,
  }
  from '@material-ui/core';
import { HashRouter, Link, Router } from 'react-router-dom';

export default function UserList2(props){
  return (
    <ListItem >
      <ListItemText>
        <Link 
          to={`/users/${props.element._id}/`}
        >
          {props.element.first_name} { props.element.last_name}
        </Link>
        <Divider />
      </ListItemText> 
    </ListItem>
  )
}
