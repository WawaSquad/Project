
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var signin = require('./routes/signin');
var register = require('./routes/register');
var userPage = require('./routes/userPage');
var board = require('./routes/board');
var photos = require('./routes/photos');
var photoSearch = require('./routes/photoSearch');
var add_rating=require('./routes/add_rating');
var friendBoard = require('./routes/friendBoard');
var login = require('./routes/login');
//var success = require('./routes/success');
//var fail = require('./routes/fail');
var registerUser = require('./routes/registerUser');
var logout = require('./routes/logout');
//var user = require('./routes/user');
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
//app.get('/success',success.success);
//app.get('/fail', fail.fail);
//app.get('/users', user.list);


http.createServer(app).listen(app.get('port'), function(){
console.log('Express server listening on port ' + app.get('port'));
});
