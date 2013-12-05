
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var signin = require('./routes/signin');
var editUserPage = require('./routes/editUserPage');
var register = require('./routes/register');
var userPage = require('./routes/userPage');
var board = require('./routes/board');
var photos = require('./routes/photos');
var photoSearch = require('./routes/photoSearch');
var add_rating=require('./routes/add_rating');
var friendBoard = require('./routes/friendBoard');
var login = require('./routes/login');
var interest = require('./routes/editInterest');
var add_empty_board = require('./routes/add_empty_board');

var registerUser = require('./routes/registerUser');
var logout = require('./routes/logout');
var addBoard = require('./routes/addBoard');
var friendsPhoto = require('./routes/friendsPhoto');
var recommendation = require('./routes/recommendation');
var pin_it=require('./routes/pin_it');
var pinned=require('./routes/pinned');
var removePhoto= require('./routes/removePhoto');
var add_new_photo=require('./routes/add_new_photo');
var changePass = require('./routes/changePassword');

var http = require('http');
var path = require('path');
var app = express();


//all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.post('/editPassword', changePass.editPassword);
app.get('/changePassword', changePass.changePassword);

//development only
if ('development' == app.get('env')) {
app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/signin', signin.signin);
app.get('/register', register.register);
app.post('/userPage', userPage.userPage);
app.get('/userPage', userPage.userPage);
app.get('/board', board.board);
app.get('/photos', photos.photos);
app.get('/photoSearch', photoSearch.photoSearch);
app.get('/add_rating', add_rating.add_rating);
app.get('/friendBoard', friendBoard.friendBoard);
app.post('/login', login.login);
app.post('/registerUser', registerUser.registerUser);
app.get('/logout',logout.logout);
app.get('/addBoard',addBoard.addBoard);
app.get('/friendsPhoto',friendsPhoto.friendsPhoto);
app.get('/editUserPage', editUserPage.editUserPage);
app.post('/editInfo', editUserPage.editInfo);
app.get('/recommendation',recommendation.recommendation);
app.get('/pin_it', pin_it.pin_it);
app.get('/pinned', pinned.pinned);
app.get('/interest', interest.interest );
app.post('/editInterest', interest.editInfo );
app.get('/removePhoto', removePhoto.remove_photos);
app.get('/add_new_photo', add_new_photo.add_new_photo);
app.get('/add_empty_board', add_empty_board.add_empty_board);

//app.get('/success',success.success);
//app.get('/fail', fail.fail);
//app.get('/users', user.list);



/*-------------for MongoDB------------------*/
var MongoDb = require("mongodb"),
db = new MongoDb.Db("test", new MongoDb.Server("localhost", 27017, {auto_reconnect: true}, {}),{fsync:false}),
fs = require("fs");
db.open(function(err, db) { }); // end of db.open
console.log('opening db..');

var GridStore = MongoDb.GridStore;
var mongo= require('./routes/mongo');
var mongoQuery= require('./routes/mongoQuery');
var mongoQuery2= require('./routes/mongoQuery2');
app.get('/mongo', mongo.mongo);
app.get('/storemongo',mongoQuery.storemongo);
app.get('/searchmongo',mongoQuery2.searchmongo);
app.get('/mongoimages/:imgtag', function(req, res) {
	// retrieve image corresponding imgtag
	console.log(req.params.imgtag);
	
	var imageName = req.params.imgtag;
	var imageType = imageName.charAt(imageName.length-3) + imageName.charAt(imageName.length-2) +imageName.charAt(imageName.length-1);
	console.log(imageType);
	loadImageGrid(imageName, imageType, res);	
}
	);


function loadImageGrid (imageName,imageType, res){

	 
	 	//if(err) throw err;
	 	//console.log('Opening db to retreive an image');
	 		 // Define the file we wish to read
	 	    var gs2 = new GridStore(db, imageName, "r");
	 	    // Open the file		            
	 	    gs2.open(function(err, gs2) {
	 	    	if(err) throw err;
	         	 console.log('Opening GS..');
	 	      // Set the pointer of the read head to the start of the gridstored file
	 	      gs2.seek(0, function() {
	 	    	  if(err) throw err;
	 	        	 console.log('Pointing the head of the image to read..');
	 	        // Read the entire file
	 	    	 gs2.read(function(err, imageData) {		               
	 	    		 if(err) throw err;
	 	        	 console.log('Reading the image..');
	 	        	 gs2.close(function(err, gs2) {
	 	        		 if(err) throw err;
	 		        	 console.log('Done reading. Closing GS..');	 	          
	 	          			//db.close();
	 	          			console.log('Closing the db..');
	 	          			
	 	          			console.log('Load the image done..');
	 	          			
	 	          			res.writeHead('200', {'Content-Type': 'image/' + imageType });	          		    
	 	          		    res.end(new Buffer(imageData).toString(),'base64');	 	          		   
	 	          		   // res.end(data,'binary');
	 	          }); // end of gs2.close
	 	        }); // end of gs2. read
	 	      }); // end of gs2.seek
	 	    });  // end of gs2.open 
	
	 	
	 }	 
	
/*------------------------------*/



http.createServer(app).listen(app.get('port'), function(){
console.log('Express server listening on port ' + app.get('port'));
});
