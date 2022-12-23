import React from 'react';
import './userPhotos.css';
import axios from 'axios';

/**
 * Define UserPhotos, a React componment of CS142 project #5
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photosDetail: [],
      isFavorite: []
    };
  }

  componentDidMount() {
    var id = this.props.match.params.userId;
    var photos = axios.get("/photosOfUser/" + id);
    photos.then((response) => {
      var photosModel = response.data;
      this.setState({photosDetail: photosModel});
      var photosIdArr = [];
      for (var i = 0; i < this.state.photosDetail.length; i++) {
        photosIdArr.push(this.state.photosDetail[i]._id);
      }
      // Nested axios call, might be better to use chained .then()
      var checkPhotos = axios.post('/check_favorites', {photosIdArr: photosIdArr});
      checkPhotos.then((response) => {
        var checkPhotosModel = response.data;
        this.setState({isFavorite: checkPhotosModel});
      }).catch((error) => {
        console.log(error);
      });
    }).catch((err) => {
      console.log(err);
    });
  }

  handleAddFavorite(event) {
    var buttonId = event.target.id;
    var addFavoriteButton = document.getElementById(buttonId);
    addFavoriteButton.disabled = "disabled";
    var photoId = this.state.photosDetail[buttonId]._id;
    axios.post('/add_favorites', {photoId: photoId});
    event.preventDefault();
  }

  displayPhotosAndComments() {
    var retVal = [];
    var userPhotos = this.state.photosDetail;
    if (userPhotos.length === 0) {
      retVal.push(<div key={-10000}>This user has not uploaded any photos.</div>);
    } else {
      for (var i = 0; i < userPhotos.length; i++) {
        var imageSource = "/images/" + userPhotos[i].file_name;
        var imageDateTime = userPhotos[i].date_time;
        var imageComments = [];

        if (userPhotos[i].comments !== undefined && userPhotos[i].comments.length !== 0) {
          for (var j = 0; j < userPhotos[i].comments.length; j++) {
            imageComments.push(<span key={8*j}>Comment: {userPhotos[i].comments[j].comment}</span>);
            imageComments.push(<br key={8*j+1}/>);
            imageComments.push(<span key={8*j+2}>Date and time of this comment: {userPhotos[i].comments[j].date_time}</span>);
            imageComments.push(<br key={8*j+3}/>);
            var linkToUser = "http://localhost:3000/photo-share.html#/users/" + userPhotos[i].comments[j].user._id;
            imageComments.push(<span key={8*j+4}>Name of the user who created this comment:
              <a key={8*j+5} href={linkToUser}>
              {userPhotos[i].comments[j].user.first_name + ' ' + userPhotos[i].comments[j].user.last_name}
              </a>
            </span>);
            imageComments.push(<br key={8*j+6}/>);
            imageComments.push(<br key={8*j+7}/>);
          }
        } else {
          var k = 0;
          imageComments.push(<span key={-3*k-1}>This photo has no corresponding comments.</span>);
          imageComments.push(<br key={-3*k-2}/>);
          imageComments.push(<br key={-3*k-3}/>);
          k++;
        }

        var photoId = this.state.photosDetail[i]._id;
        var addCommentURL = "/photo-share.html#/addComments/" + photoId;
        var buttonComponent;
        if (this.state.isFavorite[i]) {
          buttonComponent = (
            <span className="favorite_tag">
              This photo has already been added to your favorite!
            </span>
          );
        } else {
          buttonComponent = (
            <button id={i} type="button" onClick={(e) => this.handleAddFavorite(e)}>
              Add to favorite
            </button>
          );
        }

        retVal.push(
          <div key={10000+1*i}>
            <img src={imageSource} width="300" height="200" />
            <div>
              Date and time of photo creation: {imageDateTime} &nbsp;&nbsp;
              {buttonComponent}
              <br/>
              <a href={addCommentURL}>
                Add a comment
              </a>
              <br/>
              <br/>
              <b>The comments of this photo are listed below:</b>
              <div>
                {imageComments}
              </div>
            </div>
          </div>);
      }
    }

    return retVal;
  }

  render() {
    return (
      <div>
        {this.displayPhotosAndComments()}
      </div>
    );
  }
}

export default UserPhotos;
