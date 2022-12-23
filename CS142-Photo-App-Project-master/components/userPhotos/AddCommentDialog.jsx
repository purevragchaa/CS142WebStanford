import React from 'react';
import './AddCommentDialog.css';
import axios from 'axios';
import InputTrigger from 'react-input-trigger';

/**
 * Define AddCommentDialog, a React componment of CS142 project #7
 */
class AddCommentDialog extends React.Component {
  constructor(props) {
    super(props);
    this.photoId = this.props.match.params.photoId;
    this.handleAddComment = this.handleAddComment.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleSuggestor = this.toggleSuggestor.bind(this);
    this.handleMentionInput = this.handleMentionInput.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.state = {
      top: null,
      left: null,
      showSuggestor: false,
      mentionText: "",
      currentSelection: 0,
      startPosition: null,
      inputComment: "",
      commentIsEmpty: false,
      divHeight: "",
      usersNameArr: [],
      usersIdArr: [],
      originalUsersNameArr: [],
      mentionedUsersIdArr: []
    };
  }

  componentDidMount() {
    var userModel = axios.get('/user/list');
    userModel.then((response) => {
      let usersNameInfo = [];
      let usersIdInfo = [];
      for (var i = 0; i < response.data.length; i++) {
        usersNameInfo.push(response.data[i].first_name + ' ' + response.data[i].last_name);
        usersIdInfo.push(response.data[i]._id);
      }
      var numOfUsers = usersNameInfo.length;
      var numOfPixels = 13.25*numOfUsers + "px";
      this.setState({
        usersNameArr: usersNameInfo,
        originalUsersNameArr: usersNameInfo,
        usersIdArr: usersIdInfo,
        divHeight: numOfPixels
      });
    }).catch((err) => {
      console.log(err);
    });
  }

  handleAddComment(event) {
    this.setState({inputComment: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.inputComment.length === 0 || this.state.inputComment === null) {
      this.setState({commentIsEmpty: true});
    } else {
      this.setState({commentIsEmpty: false});
      var commentObj = {comment: this.state.inputComment};
      var postURL = '/commentsOfPhoto/' + this.photoId;
      axios.post(postURL, commentObj).then((res) => {
        console.log(res);
        window.history.back();
      }).catch((err) => {
        console.log(err);
      });

      for (var i = 0; i < this.state.originalUsersNameArr.length; i++) {
        if (this.state.inputComment.includes(this.state.originalUsersNameArr[i])) {
          this.state.mentionedUsersIdArr.push(this.state.usersIdArr[i]);
        }
      }
      axios.post('/photosOfUser/mentions', {
        photoId: this.photoId,
        user_id_arr: this.state.mentionedUsersIdArr
      });
      this.setState({mentionedUsersIdArr: []});
    }
  }

  handleMentionInput(metaInformation) {
    this.setState({
      mentionText: metaInformation.text,
    });
  }

  handleKeyDown(event) {
    const { which } = event;
    var { currentSelection, usersNameArr } = this.state;
    var currentLength = this.state.usersNameArr.filter(
      userNames => userNames.indexOf(this.state.mentionText) !== -1
    ).length;

    if (which === 40 ) { // 40 is the character code of the down arrow
      event.preventDefault();
      this.setState({
        currentSelection: currentSelection + 1 < 0 ?
        currentLength -(-(currentSelection + 1) % currentLength) :
        (currentSelection + 1) % currentLength,
      });
    }

    if (which === 38) { // 38 is the character code of the up arrow
      event.preventDefault();
      this.setState({
        currentSelection: currentSelection - 1 < 0 ?
        currentLength -(-(currentSelection - 1) % currentLength) :
        (currentSelection - 1) % currentLength,
      });
    }

    if (which === 13) { // 13 is the character code for enter
      event.preventDefault();
      usersNameArr = this.state.usersNameArr;
      currentSelection = this.state.currentSelection;
      var { startPosition, inputComment, originalUsersNameArr } = this.state;
      var filteredUsersNameArr = usersNameArr.filter(userNames => userNames.indexOf(this.state.mentionText) !== -1);
      var user = filteredUsersNameArr[currentSelection];
      if (user !== undefined && user !== null) {
        var newText = `${inputComment.slice(0, startPosition - 1)}` + '@' +
        `${user}${inputComment.slice(startPosition + user.length, inputComment.length)}`;
        this.setState({
          showSuggestor: false,
          left: null,
          top: null,
          mentionText: "",
          startPosition: null,
          inputComment: newText,
          usersNameArr: originalUsersNameArr
        });

        // var index = originalUsersNameArr.indexOf(user);
        // var userId = this.state.usersIdArr[index];
        // if (!this.state.mentionedUsersIdArr.includes(userId)) {
        //   this.state.mentionedUsersIdArr.push(userId);
        // }
      }

      this.endHandler();
    }
  }

  showEmptyMessage() {
    if (this.state.commentIsEmpty === true) {
      var emptyMessage = (
        <span style={{color: "red"}}>
          Comment cannot be empty. Please try again.
        </span>
      );
      return emptyMessage;
    }
    return;
  }

  toggleSuggestor(metaInformation) {
    const { hookType, cursor } = metaInformation;

    if (hookType === 'start') {
      this.setState({
        showSuggestor: true,
        left: cursor.left,
        top: cursor.top + 100,
        startPosition: cursor.selectionStart,
      });
    }

    if (hookType === 'cancel') {
      this.setState({
        showSuggestor: false,
        left: null,
        top: null,
        startPosition: null,
      });
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} style={{position: 'relative'}}
      onKeyDown={this.handleKeyDown}>
        <label>
          Please enter your comment here:<br/>
          @Mentions:&nbsp;
          <i>
            To @mention a user, please user UP or DOWN key on your keyboard to select a user.
            When you find the user you want to @mention, please press ENTER.
          </i>
          <br/>
          <br/>
          <InputTrigger
            trigger={{keyCode: 50, shiftKey: true,}}
            onStart={(metaData) => { this.toggleSuggestor(metaData); }}
            onCancel={(metaData) => { this.toggleSuggestor(metaData); }}
            onType={(metaData) => { this.handleMentionInput(metaData); }}
            endTrigger={(endHandler) => { this.endHandler = endHandler; }}
          >
            <textarea type="text" value={this.state.inputComment}
            onChange={this.handleAddComment} className="comment"
            wrap="hard" cols="20" />
          </InputTrigger>
          <div
            id="dropdown"
            style={{
              position: "absolute",
              height: this.state.divHeight,
              width: "150px",
              borderRadius: "6px",
              background: "white",
              boxShadow: "rgba(0, 0, 0, 0.4) 0px 1px 4px",
              display: this.state.showSuggestor ? "block" : "none",
              top: this.state.top,
              left: this.state.left,
          }}>
            {
              this.state.usersNameArr.filter(userNames => userNames.indexOf(this.state.mentionText) !== -1)
              .map((userNames, index) => (
              <div
                style={{
                  padding: '1px 4px',
                  fontSize: 'x-small',
                  background: index === this.state.currentSelection ? '#eee' : ''
                }}
                key={index}
              >
                { userNames }
              </div>
              ))
            }
          </div>
        </label>
        {this.showEmptyMessage()}
        <br/>
        <br/>
        <input type="submit" value="Submit" />
      </form>
    );
  }

}

export default AddCommentDialog;
