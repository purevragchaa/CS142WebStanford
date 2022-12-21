import React from 'react';
import {
  Paper,
  Typography,
  Divider,
  List,
  ListItem,
} from '@material-ui/core';
import { HashRouter, Link, Router } from 'react-router-dom';
import './userPhotos.css';
import fetchModel from '../../lib/fetchModelData';

/*
 * Define UserPhotos, a React componment of CS142 project #5
 */

class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: {}
    }    

  }
  componentDidMount() {
    this.componentDidUpdate()
  }
    
  componentDidUpdate() {
    let userId = this.props.match.params.userId
    // Async call to server
    fetchModel(`http://localhost:3000/photosOfUser/${userId}`)
      .then((data) => {
        console.log( "===================" );
        console.log( "user photos" );
        console.log( data.data );
        console.log( "===================" );
        this.setState({ photos : data.data });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    // const photos = window.cs142models.photoOfUserModel(this.props.match.params.userId);
    // console.log( "===============>");
    // console.log(photos);
    console.log( "=======================");
    console.log( this.state.photos);
    console.log( "=======================");
    let writedComment;
    let c;
    // console.log(writedComment);
    
    return (
      <div>
        {
          this.state.photos.length > 0 && this.state.photos.map(( element, index) => (
            writedComment = element.comments,
            c = writedComment != undefined,
            // console.log("comment_id",writedComment),
            <Paper key={index}>
              <Typography>
                {element.date_time}
              </Typography>
              <img style={{ width: "50%", height: "60%" }}
                src={'/../../images/' + element.file_name}
              />
              <div style={{ width: "50%", height: "60%" }}>
                { c ?
                  writedComment.map((commentIndex, index) =>(
                    <List key={index}>
                      {/* {console.log("=======",commentIndex)} */}
                      {/* {console.log("user_id",commentIndex.user._id)} */}

                      <Link to={`/users/${commentIndex.user._id}`}>{commentIndex.user.first_name} </Link> 
                      <ListItem>                                           
                        { commentIndex.comment}
                      </ListItem> 
                      <ListItem>{commentIndex.date_time}</ListItem>
                    </List>
                  ))
                  : <p>no comment</p>
                }
              </div>
              <Divider/>
            </Paper>                                             
          ))
        }       
      </div>
    );
  }
}

export default UserPhotos;
