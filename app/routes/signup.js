var User = require('../schemas/user');

var config = require('../../config');
var session = require('express-session');

var secretKey = config.secretKey;

module.exports = function(app, express) {

	var api = express.Router();

	api.post('/signup', function(req, res) {

		var user = new User({
			fname: req.body.fname,
			lname: req.body.lname,
			email: req.body.email,
			username: req.body.username,
			password: req.body.password
		});

		user.save(function(err) {
			if(err) {
				res.send({message: 'Unsuccess', error:err});
				return;
			}

			res.json({message: 'Success'});
		});
	});

	api.post('/users', function(req, res) {

		var user = new User({
			fname: req.body.fname,
			lname: req.body.lname,
			email: req.body.email,
			username: req.body.username,
			password: req.body.password
		});
		User.findOne({username:req.body.username, password:req.body.password}, function(err, user){
			if(err){
				return res.status(500).send();
			}

			if(!user){
				return res.status(404).send();
			}
			req.session.user = user;
			return res.status(200).send({message:'Success', user: user});
		})
		/*User.find({}, function(err, users) {
			if(err) {
				res.send(err);
				return;
			}else{
				var user;
				for(var i=0; i<users.length; i++){
					if(users[i].username == req.body.username && users[i].password == req.body.password){
						user = true;
						res.send({message:'Success', user: users[i]});
					}
				}
				if(user != true){
					res.send({message:'Unsuccess'});
				}
			}
		});*/

		api.get('/dashboard', function(req, res) {
			if(!req.session.user) {
				return res.status(401).send();
			}

			return res.status(200).send({message:'Success', user: user});
		})

		api.get('/logout', function(req, res) {
			if(!req.session.user) {
				return res.status(401).send();
			}

			req.session.user = null;
			return res.status(200).send({message:'Successfully logged out'});
		})
	});

	return api

}