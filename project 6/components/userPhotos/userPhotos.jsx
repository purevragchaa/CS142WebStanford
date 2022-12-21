import React, {useState, useEffect} from 'react';
import {
  Paper,
  Typography,
  Divider,
  List,
  ListItem,
} from '@material-ui/core';
import './userPhotos.css';
import fetchModel from '../../lib/fetchModelData';
import Comments from '../comment/comments';

/*
 * Define UserPhotos, a React componment of CS142 project #5
 */

const UserPhotos = ( props ) => {

  console.log( props.match.params.userId);
  const [photos, setPhotos] = useState( [] )
  let writedComment;
  let c;
  useEffect(
    () => {
      let userId = props.match.params.userId
      const result = fetchModel(`http://localhost:5000/photosOfUser/${userId}`, setPhotos)
      console.log( result );
      console.log( "photos list" );
      console.log( photos );
    }
    //yu oorchlogdvol dahiad duudah huvisgchaa ene massv hiij ogno
    , [

    ]
  )
  console.log( "========================================" );
  console.log( photos );

  return (
      <div>
        {
          photos.length > 0 && photos.map(( element, index) => (
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
                   <Comments 
                    key = {index}
                    el = {commentIndex }
                   />
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

export default UserPhotos;
