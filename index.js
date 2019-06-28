var express = require('express');
var path = require('path');
var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var config = require('./config/config.js');
var connectmongo = require('connect-mongo')(session);
var mongoose = require('mongoose')
mongoose.connect(config.dbURL, { useNewUrlParser: true });
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var rooms = [] 
 
app.set('views',path.join(__dirname, 'views')); 
 
//hogan express for using html templates and not jade
app.engine('html',require('hogan-express'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
 
//for session management using cookie parser
app.use(cookieParser());
 
var env = process.env.NODE_ENV || 'development';
if(env === 'development'){
	//dev specific settings
	app.use(session({secret: config.sessionSecret, saveUninitialized : true,resave : true}));

}else{	        
	//prod specific settings
	app.use(session({secret: config.sessionSecret, 
		saveUninitialized : true,
		resave : true,
		store : new connectmongo({
			//url:config.dbURL,
			mongoose_connection: mongoose.connections[0],
			stringify : true
		})
	}));
}   		
  
app.use(passport.initialize());
app.use(passport.session());

require('./routes/routes.js')(express,app,passport,config,rooms);
require('./auth/passportAuth.js')(passport,FacebookStrategy,config,mongoose);

app.set('port',process.env.PORT || 5000);
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

require('./socket/socket.js')(io,rooms);

server.listen(app.get('port'), function(){
	console.log('Running on http://localhost:' + app.get('port'));
})