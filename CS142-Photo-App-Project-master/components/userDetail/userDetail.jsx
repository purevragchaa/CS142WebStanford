import React from 'react';
import './userDetail.css';
import axios from 'axios';

/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      id: 0,
      mentionedPhotosArr: [],
      mentionedPhotosOwnerIdArr: [],
      mentionedPhotosOwnerNameArr: []
    };
  }

  componentDidMount() {
    var id = this.props.match.params.userId;
    var userDetailModel = axios.get("/user/" + id);
    userDetailModel.then((response) => {
      var userInfoModel = {
        _id: response.data._id,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        location: response.data.location,
        description: response.data.description,
        occupation: response.data.occupation
      };
      this.setState({userInfo: userInfoModel, id: id});
    }).catch((err) => {
      console.log(err);
    });
    axios.get("/userMentions/" + id).then((response) => {
      if (id !== this.state.id) {
        let fileNamesArr = [];
        let ownerIdArr = [];
        let ownerNameArr = [];
        for (var i = 0; i < response.data.length; i++) {
          fileNamesArr.push(response.data[i].file_name);
          ownerIdArr.push(response.data[i].owner_id);
          ownerNameArr.push(response.data[i].owner_name);
        }
        this.setState({
          mentionedPhotosArr: fileNamesArr,
          mentionedPhotosOwnerIdArr: ownerIdArr,
          mentionedPhotosOwnerNameArr: ownerNameArr
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  componentDidUpdate() {
    var id = this.props.match.params.userId;
    var userDetailModel = axios.get("/user/" + id);
    userDetailModel.then((response) => {
      if (id !== this.state.id) {
        var userInfoModel = {
          _id: response.data._id,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          location: response.data.location,
          description: response.data.description,
          occupation: response.data.occupation
        };
        this.setState({userInfo: userInfoModel, id: id});
      }
    }).catch((err) => {
      console.log(err);
    });
    axios.get("/userMentions/" + id).then((response) => {
      if (id !== this.state.id) {
        let fileNamesArr = [];
        let ownerIdArr = [];
        let ownerNameArr = [];
        for (var i = 0; i < response.data.length; i++) {
          fileNamesArr.push(response.data[i].file_name);
          ownerIdArr.push(response.data[i].owner_id);
          ownerNameArr.push(response.data[i].owner_name);
        }
        this.setState({
          mentionedPhotosArr: fileNamesArr,
          mentionedPhotosOwnerIdArr: ownerIdArr,
          mentionedPhotosOwnerNameArr: ownerNameArr
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  displayMentions() {
    var retVal;
    if (this.state.mentionedPhotosArr.length !== 0) {
      var mentionedPhotos = [];
      for (var i = 0; i < this.state.mentionedPhotosArr.length; i++) {
        var imageSource = "/images/" + this.state.mentionedPhotosArr[i];
        var imageLink = "http://localhost:3000/photo-share.html#/photos/" + this.state.mentionedPhotosOwnerIdArr[i];
        var userDetailLink = "http://localhost:3000/photo-share.html#/users/" + this.state.mentionedPhotosOwnerIdArr[i];
        mentionedPhotos.push(
          <a href={imageLink} key={5*i}>
            <img src={imageSource} width="100" height="100" />
          </a>
        );
        mentionedPhotos.push(
          <span key={5*i+1}>
            &nbsp;Owner of the photo:&nbsp;
          </span>
        );
        mentionedPhotos.push(
          <a href={userDetailLink} key={5*i+2}>
            {this.state.mentionedPhotosOwnerNameArr[i]}
          </a>
        );
        mentionedPhotos.push(<br key={5*i+3} />);
        mentionedPhotos.push(<br key={5*i+4} />);
      }
      retVal = (
        <div>
          <p>
            The user is @mentioned in the comments of the photos shown below:
          </p>
          {mentionedPhotos}
        </div>
      );
    } else {
      retVal = (
        <div>
          This user is not mentioned by any photo comments.
        </div>
      );
    }
    return retVal;
  }

  render() {
    var userDetail = this.state.userInfo;
    var photoLink = "http://localhost:3000/photo-share.html#/photos/" + userDetail._id;
    return (
      <div>
        <h2>
          Details of {userDetail.first_name} {userDetail.last_name}:
        </h2>
        <div>
          <p>
            First name: {userDetail.first_name}
          </p>
          <p>
            Last name: {userDetail.last_name}
          </p>
          <p>
            User ID: {userDetail._id}
          </p>
          <p>
            Location: {userDetail.location}
          </p>
          <p>
            Description: {userDetail.description}
          </p>
          <p>
            Occupation: {userDetail.occupation}
          </p>
          <p>
            To see the photos and comments of this user, please click <a href={photoLink}>here</a>.
          </p>
          {this.displayMentions()}
        </div>
      </div>
    );
  }
}

export default UserDetail;
