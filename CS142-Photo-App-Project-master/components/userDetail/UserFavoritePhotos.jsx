import React from 'react';
import './userFavoritePhotos.css';
import axios from 'axios';
import {
  Divider,
  List,
  ListItem,
  ListItemText,
}
from '@material-ui/core';
import Modal from 'react-modal';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

Modal.setAppElement('body')
/**
 * Define UserFavoritePhotos, a React componment of CS142 project #8
 */

 class UserFavoritePhotos extends React.Component {
   constructor(props) {
     super(props);
     this.state = {
       favoritePhotosDetail: [],
       modalIsOpen: false,
       modalImageFileName: "",
       modalImageDescription: ""
     };

     this.closeModal = this.closeModal.bind(this);
   }

   componentDidMount() {
     axios.get('/favorites').then((response) => {
       this.setState({favoritePhotosDetail: response.data});
     }).catch((err) => {
       console.log(err);
     });
   }

   displayPhotos() {
     var photoList = [];
     if (this.state.favoritePhotosDetail.length === 0) {
       photoList.push(
         <div key={-1}>
           You currently have no favorite photos.
         </div>
       );
       return photoList;
     } else {
       for (var i = 0; i < this.state.favoritePhotosDetail.length; i++) {
         let imageSource = "/images/" + this.state.favoritePhotosDetail[i].file_name;
         let imageDescription = "  Photo taken on: " + this.state.favoritePhotosDetail[i].date_time;
         let imageId = "image_" + i;
         photoList.push(
           <ListItem key={2*i}>
             <a id={imageId} href="javascript:void(0)" onClick={(e) => this.openModal(e)}>
               <img src={imageSource} alt="caption" className="myImage" width="100" height="100" />
             </a>

             <Modal
               isOpen={this.state.modalIsOpen}
               onRequestClose={this.closeModal}
               style={customStyles}
               contentLabel="Example Modal"
             >
               <img src={this.state.modalImageFileName} width="400" height="400" />
               <br/>
               <span>{this.state.modalImageDescription}</span>
             </Modal>

             <ListItemText primary={imageDescription} />
             <button id={i} type="button" className="deleteButton" onClick={(e) => this.handleDelete(e)}>
               Delete
             </button>
           </ListItem>
         );
         photoList.push(<Divider key={2*i+1}/>);
       }

       var retVal = (
         <div id="root">
           <List component="nav">
             {photoList}
           </List>
         </div>
       );
       return retVal;
     }
   }

   handleDelete(event) {
     event.preventDefault();
     var index = event.target.id;
     console.log(index);
     var photoId = this.state.favoritePhotosDetail[index].photo_id;
     axios.post('/delete_favorites', {photoId: photoId});
     axios.get('/favorites').then((response) => {
       this.setState({favoritePhotosDetail: response.data});
     }).catch((err) => {
       console.log(err);
     });
     this.render();
   }

   openModal(event) {
     var index = event.currentTarget.id.split("_")[1];
     var modalImageSource = "/images/" + this.state.favoritePhotosDetail[index].file_name;
     var modalImageDescription = "Photo taken on: " + this.state.favoritePhotosDetail[index].date_time;
     this.setState({
       modalIsOpen: true,
       modalImageFileName: modalImageSource,
       modalImageDescription: modalImageDescription
     });
   }

   closeModal() {
     this.setState({modalIsOpen: false});
   }

   render() {
     return (
       <div>
         <h3>
           Your favorite photos are displayed below:
         </h3>
         <br/>
         {this.displayPhotos()}
       </div>
     );
   }
 }

 export default UserFavoritePhotos;
