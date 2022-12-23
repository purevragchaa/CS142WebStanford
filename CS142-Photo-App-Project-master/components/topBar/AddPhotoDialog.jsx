import React from 'react';
import './AddPhotoDialog.css';
import axios from 'axios';

/**
 * Define AddPhotoDialog, a React componment of CS142 project #7
 */
class AddPhotoDialog extends React.Component {
  constructor(props) {
    super(props);

  }

  //this function is called when user presses the update button
  handleUploadButtonClicked = (e) => {
    e.preventDefault();
    if (this.uploadInput.files.length > 0) {
      // Create a DOM form and add the file to it under the name uploadedphoto
      const domForm = new FormData();
      domForm.append('uploadedphoto', this.uploadInput.files[0]);
      axios.post('/photos/new', domForm).then((res) => {
        var photoURL = "/photo-share.html#/photos/" + res.data.user_id;
        window.location.assign(photoURL);
      }).catch((err) => {
        console.log(`POST ERR: ${err}`)
      });
    }

  }


  render() {
    return (
      <form onSubmit={this.handleUploadButtonClicked}>
        <label>
          Please select your photo from your local storage by clicking on the &quot;Choose File&quot; button below: <br/>
          Note:&nbsp;
          <i>
            Clicking on &quot;upload&quot; button below will redirect you to your own photos page.
            If you do not choose a photo, clicking on &quot;upload&quot; button below will do nothing.
          </i>
          <br/>
          <br/>
          <input type="file" accept="image/*" ref={(domFileRef) => { this.uploadInput = domFileRef; }} />
        </label>
        <br/>
        <br/>
        <input type="submit" value="Upload Photo" />
      </form>
    );
  }

}

export default AddPhotoDialog;
