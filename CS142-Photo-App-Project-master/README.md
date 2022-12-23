# CS142-Photo-App-Project  
  
## Basic Features  
  
In this project, I built a full-stack photo sharing app using React.js for front-end view, Express.js for controller, and MongoDB for storage system. In this photo sharing app, users can:<br/>
1. Creating a new user account with "Register"<br/>
2. Log in with the existing username and password<br/>
3. View details of other users<br/>
4. See photos posted by other users and add comments<br/>
5. Upload new photos<br/>

## Special Features

Besides the basic features described above, the photo app also supports:<br/>
* @mentions in comments:<br/>
Users can @mention another user (including himself or herself) by entering "@" when adding comments. If a user is @mentioned, the related photo will be shown in a list below the user detail page.<br/>
* Favorite list of photos:<br/>
Users can add a photo to his/her favorite list of photos. If a photo is favorited, it cannot be added to the favorite list again, but the user can delete it from the favorite list and re-add it. By clicking on the photos in the favorite list, a modal window will pop up, showing a larger version of the photo and its date of creation.
