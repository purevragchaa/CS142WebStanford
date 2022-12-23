"use strict";

/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the database.
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 *
 */

/*********************** Add express-ession, bodyParser and multer modules****************************/
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require("fs");

var processFormBody = multer({storage: multer.memoryStorage()}).single('uploadedphoto');
/*********************** Add express-ession, bodyParser and multer modules****************************/

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var async = require('async');

// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var SchemaInfo = require('./schema/schemaInfo.js');

var express = require('express');
var app = express();

// XXX - Your submission should work without this line
// var cs142models = require('./modelData/photoApp.js').cs142models;

mongoose.connect('mongodb://localhost/cs142project6', { useMongoClient: true });

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));
app.use(session({secret: 'secretKey', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());


app.get('/', function (request, response) {
    response.send('Simple web server of files from ' + __dirname);
});

/*
 * Use express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */
app.get('/test/:p1', function (request, response) {
    // Express parses the ":p1" from the URL and returns it in the request.params objects.
    console.log('/test called with param1 = ', request.params.p1);

    var param = request.params.p1 || 'info';

    if (param === 'info') {
        // Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
        SchemaInfo.find({}, function (err, info) {
            if (err) {
                // Query returned an error.  We pass it back to the browser with an Internal Service
                // Error (500) error code.
                console.error('Doing /user/info error:', err);
                response.status(500).send(JSON.stringify(err));
                return;
            }
            if (info.length === 0) {
                // Query didn't return an error but didn't find the SchemaInfo object - This
                // is also an internal error return.
                response.status(500).send('Missing SchemaInfo');
                return;
            }

            // We got the object - return it in JSON format.
            console.log('SchemaInfo', info[0]);
            response.end(JSON.stringify(info[0]));
        });
    } else if (param === 'counts') {
        // In order to return the counts of all the collections we need to do an async
        // call to each collections. That is tricky to do so we use the async package
        // do the work.  We put the collections into array and use async.each to
        // do each .count() query.
        var collections = [
            {name: 'user', collection: User},
            {name: 'photo', collection: Photo},
            {name: 'schemaInfo', collection: SchemaInfo}
        ];
        async.each(collections, function (col, done_callback) {
            col.collection.count({}, function (err, count) {
                col.count = count;
                done_callback(err);
            });
        }, function (err) {
            if (err) {
                response.status(500).send(JSON.stringify(err));
            } else {
                var obj = {};
                for (var i = 0; i < collections.length; i++) {
                    obj[collections[i].name] = collections[i].count;
                }
                response.end(JSON.stringify(obj));

            }
        });
    } else {
        // If we know understand the parameter we return a (Bad Parameter) (400) status.
        response.status(400).send('Bad param ' + param);
    }
});

/*
 * URL /user/list - Return all the User object.
 */
app.get('/user/list', function (request, response) {
    var session_user_id = request.session.user_id;
    if (session_user_id !== undefined && session_user_id !== null) {
        User.find({}, function(err, info) {
            if (err) {
                console.error('Doing /user/list error: ', err);
                response.status(500).send(JSON.stringify(err));
                return;
            }
            if (info.length === 0) {
                response.status(500).send('Missing User');
                return;
            }
            let userList = [];
            for (var i = 0; i < info.length; i++) {
                var userObj = {
                    _id: info[i]._id,
                    first_name: info[i].first_name,
                    last_name: info[i].last_name,
                };
                userList.push(userObj);
            }
            response.status(200).send(userList);
        });
        console.log('Returned all the User object.');
    } else {
        response.status(401).send('Unauthorized user.');
    }

});

/*
 * URL /user/:id - Return the information for User (id)
 */
app.get('/user/:id', function (request, response) {
    var session_user_id = request.session.user_id;
    if (session_user_id !== undefined && session_user_id !== null) {
        var id = request.params.id;
        User.findOne({_id: id}, function(err, user) {
            if (err) {
                console.error('Doing /user/:id error: ', err);
                response.status(400).send(JSON.stringify(err));
                return;
            }
            if (user === null || user === undefined) {
                console.log('User with _id:' + id + ' not found.');
                response.status(400).send('Not found');
                return;
            }
            response.status(200).send({
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                location: user.location,
                description: user.description,
                occupation: user.occupation
            });
        });
        console.log('Returned the user detail with id: ' + id);
    } else {
        response.status(401).send('Unauthorized user.');
    }
});

app.get('/loginUser', function(request, response) {
    var session_user_id = request.session.user_id;
    var session_user_first_name = request.session.first_name;
    var session_user_last_name = request.session.last_name;
    if (session_user_id !== undefined && session_user_id !== null) {
        var loginUserDetail = {
            _id: session_user_id,
            first_name: session_user_first_name,
            last_name: session_user_last_name
        };
        response.status(200).send(loginUserDetail);
    } else {
        response.status(401).send('Unauthorized user.');
    }
});

/*
 * URL /photosOfUser/:id - Return the Photos for User (id)
 */
app.get('/photosOfUser/:id', function (request, response) {
    var session_user_id = request.session.user_id;
    if (session_user_id !== undefined && session_user_id !== null) {
      var id = request.params.id;
      Photo.find({user_id: id}, function(err, photosModel) {
          if (err) {
              console.error('Doing /photosOfUser/:id error: ', err);
              response.status(400).send(JSON.stringify(err));
              return;
          }
          if (photosModel === null || photosModel === undefined) {
              console.log('Photos with _id:' + id + ' not found.');
              response.status(400).send('Not found');
              return;
          }

          let photosArr = [];
          var photos = JSON.parse(JSON.stringify(photosModel));
          for (var i = 0; i < photos.length; i++) {
              let commentsArr = [];
              for (var j = 0; j < photos[i].comments.length; j++) {
                  var comment = {
                      comment: photos[i].comments[j].comment,
                      date_time: photos[i].comments[j].date_time,
                      _id: photos[i].comments[j]._id,
                      user: {_id: photos[i].comments[j].user_id}
                  };
                  commentsArr.push(comment);
              }
              var photo = {
                  _id: photos[i]._id,
                  user_id: photos[i].user_id,
                  comments: commentsArr,
                  file_name: photos[i].file_name,
                  date_time: photos[i].date_time
              };
              photosArr.push(photo);
          }
          async.each(photosArr, addUserDetails, allDone);

          function addUserDetails(photosFile, callback1) {
              async.each(photosFile.comments, function(commentsFile, callback2) {
                  var user_id = commentsFile.user._id;
                  User.findOne({_id: user_id}, function(err, author) {
                      if (!err) {
                          var author_detail = {
                              _id: author._id,
                              first_name: author.first_name,
                              last_name: author.last_name
                          };
                          commentsFile.user = author_detail;
                      }
                      callback2(err);
                  });
              }, function (error) {
                  callback1(error);
              });

          }

          function allDone(error) {
              if (error) {
                  response.status(500).send(error);
              } else {
                  console.log('Returned the user photos with id: ' + id);
                  response.status(200).send(photosArr);
              }
          }
      });
    } else {
        response.status(401).send('Unauthorized user.');
    }


});

//******************************Project 7***********************************************
app.post('/admin/login', function (request, response) {
    var loginName = request.body.login_name;
    var password = request.body.password;
    User.findOne({login_name: loginName, password: password}, function(err, info) {
        if (err) {
            console.error('Doing /admin/login error: ', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (info === null || info === undefined) {
            console.log('User login name or password not found.');
            response.status(400).send('Not found');
            return;
        }
        let session_data = request.session;
        session_data.user_id = info._id;
        session_data.first_name = info.first_name;
        session_data.last_name = info.last_name;
        response.status(200).send({
          _id: info._id,
        });
    });
});

app.post('/admin/logout', function (request, response) {
    if (request.session.user_id === null || request.session.user_id === undefined) {
        response.status(400).send('User is not logged in.');
    } else {
        request.session.destroy(function (err) {console.log(err);});
        response.status(200).send('Logout success.');
    }
});

app.post('/commentsOfPhoto/:photo_id', function(request, response) {
    var session_user_id = request.session.user_id;
    if (session_user_id === null || session_user_id === undefined) {
        response.status(401).send('Unauthorized user');
    }
    if (request.body.comment === null || request.body.comment === undefined ||
       request.body.comment.length === 0) {
        response.status(400).send('No comments added.');
    }
    var photoId = request.params.photo_id;
    var today = new Date();
    var currentTime = today.toISOString();
    var newComment = {
        comment: request.body.comment,
        user_id: session_user_id,
        date_time: currentTime
    };

    Photo.findOne({_id: photoId}, function(err, photoInfo) {
        if (err) {
            console.error('Doing /commentsOfPhoto/:photo_id error: ', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (photoInfo === null || photoInfo === undefined) {
            console.log('Photo not found.');
            response.status(400).send('Not found');
            return;
        }
        photoInfo.comments.push(newComment);
        Photo.findOneAndUpdate({_id: photoId}, {comments: photoInfo.comments}, {new: true}, function(error) {
            if (error) {
                console.error('Adding comments error: ', error);
                response.status(400).send(JSON.stringify(error));
                return;
            }
            response.status(200).send('Comment successfully added.');
        });
    });
});

app.post('/photos/new', function(request, response) {
    var session_user_id = request.session.user_id;
    if (session_user_id === null || session_user_id === undefined) {
        response.status(401).send('Unauthorized user');
    }

    processFormBody(request, response, function (err) {
        if (err || !request.file) {
            // XXX -  Insert error handling code here.
            console.log('Processing photo error.');
            response.status(400).send('Processing photo error.');
            return;
        }
        // request.file has the following properties of interest
        //      fieldname      - Should be 'uploadedphoto' since that is what we sent
        //      originalname:  - The name of the file the user uploaded
        //      mimetype:      - The mimetype of the image (e.g. 'image/jpeg',  'image/png')
        //      buffer:        - A node Buffer containing the contents of the file
        //      size:          - The size of the file in bytes

        // XXX - Do some validation here.
        // We need to create the file in the directory "images" under an unique name. We make
        // the original file name unique by adding a unique prefix with a timestamp.
        var timestamp = new Date().valueOf();
        var filename = 'U' +  String(timestamp) + request.file.originalname;

        fs.writeFile("./images/" + filename, request.file.buffer, function (err) {
            // XXX - Once you have the file written into your images directory under the name
            // filename you can create the Photo object in the database
            if (err) {
                console.log('Writing file error.');
                return;
            }
            var today = new Date();
            var currentTime = today.toISOString();
            var photoObj = {
                user_id: session_user_id,
                file_name: filename,
                date_time: currentTime,
                comments: []
            };
            Photo.create(photoObj, function(error) {
                if (error) {
                    console.error('Adding photos error: ', error);
                    response.status(400).send(JSON.stringify(error));
                    return;
                }
                response.status(200).send({user_id: session_user_id});
            });
        });
    });
});

app.post('/user', function(request, response) {
    var loginName = request.body.login_name;
    var firstName = request.body.first_name;
    var lastName = request.body.last_name;
    var location = request.body.location;
    var description = request.body.description;
    var occupation = request.body.occupation;
    var password = request.body.password;
    User.find({login_name: loginName}, function(err, info) {
        if (err) {
            console.error('Verifying username error: ', err);
            return;
        }
        if (info.length !== 0) {
            response.status(400).send('Username already exists.');
            return;
        }
        if (loginName.length === 0 || password.length === 0 ||
        firstName.length === 0 || lastName.length === 0) {
            response.status(400).send('User information not valid.');
            return;
        }
        var registeredUserObj = {
          first_name: firstName,
          last_name: lastName,
          location: location,
          description: description,
          occupation: occupation,
          login_name: loginName,
          password: password
        };
        User.create(registeredUserObj, function(error) {
            if (error) {
                console.error('Registering user error: ', error);
                response.status(400).send(JSON.stringify(error));
                return;
            }
            response.status(200).send('User successfully registered.');
        });
    })
});

//******************************Project 8***********************************************
// Used to store @mentions into the photo object
app.post('/photosOfUser/mentions', function(request, response) {
    var mentionedUsersIdArr = request.body.user_id_arr;
    var photoId = request.body.photoId;
    Photo.findOne({_id: photoId}, function(err, photoInfo) {
        if (err) {
            console.error('Doing /photosOfUser/mentions error: ', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (photoInfo === null || photoInfo === undefined) {
            console.log('Photos not found.');
            response.status(400).send('Not found');
            return;
        }

        for (var i = 0; i < mentionedUsersIdArr.length; i++) {
            if (!photoInfo.mentions.includes(mentionedUsersIdArr[i])) {
                photoInfo.mentions.push(mentionedUsersIdArr[i]);
            }
        }
        Photo.findOneAndUpdate({_id: photoId}, {mentions: photoInfo.mentions}, {new: true}, function(error) {
            if (error) {
                console.error('Adding mentions error: ', error);
                response.status(400).send(JSON.stringify(error));
                return;
            }
            response.status(200).send('Mention successfully registered.');
        });
    });
});

// Used to return all the photo objects that @mentions a user
app.get('/userMentions/:id', function(request, response) {
    var user_id = request.params.id;
    Photo.find({}, function(err, photoInfo) {
        if (err) {
            console.error('Doing /userMentions/:id error: ', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (photoInfo === null || photoInfo === undefined) {
            console.log('Photos not found.');
            response.status(400).send('Not found');
            return;
        }
        let mentionedPhotos = [];
        for (var i = 0; i < photoInfo.length; i++) {
            if (photoInfo[i].mentions.includes(user_id)) {
                mentionedPhotos.push({
                  file_name: photoInfo[i].file_name,
                  owner_id: photoInfo[i].user_id
                });
            }
        }
        async.each(mentionedPhotos, addOwnersName, allDone);

        function addOwnersName(mentionedPhotosFile, callback) {
            var ownerId = mentionedPhotosFile.owner_id;
            User.findOne({_id: ownerId}, function(error, ownerInfo) {
                if (!error) {
                    var ownerFirstName = ownerInfo.first_name;
                    var ownerLastName = ownerInfo.last_name;
                    mentionedPhotosFile.owner_name = ownerFirstName + ' ' + ownerLastName;
                }
                callback(error);
            });
        }

        function allDone(error) {
            if (error) {
                response.status(500).send(error);
            } else {
                response.status(200).send(mentionedPhotos);
            }
        }
    });
});

// Used to add photoId to the "favorite" property of a user object
app.post('/add_favorites', function(request, response) {
    var session_user_id = request.session.user_id;
    var photoId = request.body.photoId;
    if (session_user_id !== undefined && session_user_id !== null) {
        User.findOne({_id: session_user_id}, function(err, userInfo) {
            if (err) {
                console.error('Doing /add_favorites error: ', err);
                response.status(400).send(JSON.stringify(err));
                return;
            }
            if (userInfo === null || userInfo === undefined) {
                console.log('User not found.');
                response.status(400).send('Not found');
                return;
            }
            if (!userInfo.favorites.includes(photoId)) {
                userInfo.favorites.push(photoId);
            }
            User.findOneAndUpdate({_id: session_user_id}, {favorites: userInfo.favorites},
              {new: true}, function(error) {
                if (error) {
                    console.error('Adding favorite photo error: ', error);
                    response.status(400).send(JSON.stringify(error));
                    return;
                }
                response.status(200).send('Favorite photo successfully added.');
            });
        });
    } else {
        response.status(401).send('Unauthorized user');
    }
});

// Used to get all the favorite photos for the logged-in user object
app.get('/favorites', function(request, response) {
    var session_user_id = request.session.user_id;
    if (session_user_id !== undefined && session_user_id !== null) {
        User.findOne({_id: session_user_id}, function(err, userInfo) {
            if (err) {
                console.error('Doing /favorites error: ', err);
                response.status(400).send(JSON.stringify(err));
                return;
            }
            if (userInfo === null || userInfo === undefined) {
                console.log('User not found.');
                response.status(400).send('Not found');
                return;
            }
            var favoritePhotoInfo = [];
            for (var i = 0; i < userInfo.favorites.length; i++) {
                favoritePhotoInfo.push({
                    photo_id: userInfo.favorites[i],
                    owner_id: "",
                    file_name: "",
                    date_time: null
                });
            }
            async.each(favoritePhotoInfo, addPhotoDetails, allDone);

            function addPhotoDetails(favoritePhotoFile, callback) {
                var photoId = favoritePhotoFile.photo_id;
                Photo.findOne({_id: photoId}, function(error, photoInfo) {
                    if (!error) {
                        favoritePhotoFile.owner_id = photoInfo.user_id;
                        favoritePhotoFile.file_name = photoInfo.file_name;
                        favoritePhotoFile.date_time = photoInfo.date_time;
                    }
                    callback(error);
                });
            }

            function allDone(error) {
                if (error) {
                    response.status(500).send(error);
                } else {
                    response.status(200).send(favoritePhotoInfo);
                }
            }
        });
    } else {
        response.status(401).send('Unauthorized user');
    }
});

// Used to delete a favorite photo object for the logged-in user
app.post('/delete_favorites', function(request, response) {
    var session_user_id = request.session.user_id;
    var photoId = request.body.photoId;
    if (session_user_id !== undefined && session_user_id !== null) {
        User.findOne({_id: session_user_id}, function(err, userInfo) {
            if (err) {
                console.error('Doing /delete_favorites error: ', err);
                response.status(400).send(JSON.stringify(err));
                return;
            }
            if (userInfo === null || userInfo === undefined) {
                console.log('User not found.');
                response.status(400).send('Not found');
                return;
            }
            var favoritePhotos = [];
            for (var i = 0; i < userInfo.favorites.length; i++) {
                if (userInfo.favorites[i] !== photoId) {
                    favoritePhotos.push(userInfo.favorites[i]);
                }
            }
            User.findOneAndUpdate({_id: session_user_id}, {favorites: favoritePhotos},
              {new: true}, function(error) {
                if (error) {
                    console.error('Deleting favorite photo error: ', error);
                    response.status(400).send(JSON.stringify(error));
                    return;
                }
                response.status(200).send('Favorite photo successfully deleted.');
            });
        });
    } else {
        response.status(401).send('Unauthorized user');
    }
});

// Used to check if the given photos are favorited by the logged-in user
app.post('/check_favorites', function(request, response) {
    var session_user_id = request.session.user_id;
    var photosIdArr = request.body.photosIdArr;
    if (session_user_id !== undefined && session_user_id !== null) {
        User.findOne({_id: session_user_id}, function(err, userInfo) {
            if (err) {
                console.error('Doing /check_favorites error: ', err);
                response.status(400).send(JSON.stringify(err));
                return;
            }
            if (userInfo === null || userInfo === undefined) {
                console.log('User not found.');
                response.status(400).send('Not found');
                return;
            }
            var isFavoriteArr = [];
            for (var i = 0; i < photosIdArr.length; i++) {
                if (userInfo.favorites.includes(photosIdArr[i])) {
                    isFavoriteArr.push(true);
                } else {
                    isFavoriteArr.push(false);
                }
            }
            response.status(200).send(isFavoriteArr);
        });
    } else {
        response.status(401).send('Unauthorized user');
    }
});

//**************************************************************************************
var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});
