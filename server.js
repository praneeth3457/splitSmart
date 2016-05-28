var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');
var mongoose = require('mongoose');
var session = require('express-session');
var app = express();
var PORT = process.env.PORT || 3000;

mongoose.connect(config.database, function(err) {
	if(err) {
		console.log(err);
	}else{
		console.log('Connected to the database');
	}
});

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(session({secret:"udj9sd8un8d678aaf76", resave:false, saveUninitialized:true}))

var api = require('./app/routes/signup')(app, express);
var groupApi = require('./app/routes/groups')(app, express);
app.use('/api', api);
app.use('/api2', groupApi);

app.use(express.static(__dirname + '/public'));

app.listen(PORT, function(err){
	if(err){
		console.log('Error in server!');
	}else{
		console.log('Server running on port: 3000');
	}
	
});