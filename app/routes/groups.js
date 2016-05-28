var Group = require('../schemas/groups');
var User = require('../schemas/user');

var config = require('../../config');

var secretKey = config.secretKey;

module.exports = function(app, express) {

	var api = express.Router();

	api.post('/addGroup', function(req, res) {
		
		var group = new Group({
			gname: req.body.gname,
			gtype: req.body.gtype,
			gmembers: [{name: req.body.gmemberName, username : req.body.gmemberUsername}],
			gbills: [{ user: req.body.user, billFor : [req.body.billFor], 
				desciption: req.body.desciption, date: req.body.date,
				amount: req.body.amount, perPerson : req.body.perPerson}]
		});
		
		group.save(function(err) {
			if(err) {
				res.send({message: 'Unsuccess', error:err});
				return;
			}

			res.json({message: 'Success'});
		});
	});

	api.post('/getGroups', function(req, res) {
		var userGroups = [];
		Group.findOne({username:req.body.gmemberUsername}, function(err, groupsName) {	
		});
		Group.find({}, function(err, groups){
			if(err){
				res.send('Service not available!');
			}
			if(groups){
				for(var i=0; i<groups.length; i++){
					for(var j=0; j<groups[i].gmembers.length; j++){
						if(groups[i].gmembers[j].username == req.body.gmemberUsername){
							userGroups.push(groups[i]);
						}
					}
				}
				res.send(userGroups);
			}
		});
	});


	api.post('/addGroupMember', function(req, res) {
		User.findOne({username:req.body.gmemberUsername}, function(err, userName) {
			if(userName){
				Group.findOne({gname:req.body.gname}, function(err, groupsName) {	
					if(groupsName){
						Group.findByIdAndUpdate(
						    groupsName._id,
						    {$push: {"gmembers": {name : req.body.gmemberName, username : req.body.gmemberUsername}}},
						    {safe: true, upsert: true},
						    function(err, model) {
						        console.log(err);
						        console.log(model);
						    }
						);
						groupsName.save(function(err) {
							if(err) {
								res.send({message: 'Unsuccess', 'error':err, 'notExist': false});
								return;
							}

							res.json({message: 'Success'});
						});
					}

					if(err){
						res.send({message: 'Unsuccess', 'error':err, 'notExist': false});
					}	
				});
			}else{
				res.send({message: 'Unsuccess', 'error':err, 'notExist': true});
			}
		});

	});

	api.post('/getGroupUsers', function(req, res) {
		Group.findOne({gname:req.body.gname}, function(err, groupUser) {
			if(groupUser){
				res.send({groupUsers : groupUser.gmembers});
			}
		});
	});

	/*api.post('/getGroupDetails', function(req, res) {
		Group.findOne({gname:req.body.gname}, function(err, groupUser) {
			if(groupUser){
				res.send({groupUsers : groupUser.gmembers});
			}
		});
	});*/

	api.post('/addBill', function(req, res) {
		Group.findOne({gname:req.body.gname}, function(err, groupUser) {
			if(groupUser){
				Group.findByIdAndUpdate(
					groupUser._id,
					{$addToSet: {"gbills": {user : req.body.user, billFor : req.body.billFor,
								desciption : req.body.desciption, date : req.body.date, amount : req.body.amount,
								 perPerson : req.body.perPerson}
							}
						},
				    {safe: true, upsert: true},
				    function(err, model) {
				        console.log(err);
				        console.log(model);
				    }
				);

				groupUser.save(function(err) {
					if(err) {
						res.send({message: 'Unsuccess', 'error':err});
						return;
					}

					res.json({message: 'Success'});
				});
			}

			if(err){
				res.send(err);
			}
		});
	});

	/*api.post('/delGroup', function(req, res) {
		Group.findOneAndRemove({gname:req.body.groupName}, function(err, groupUser) {
			if(groupUser){
				Group.find({}, function(err, groups){
					console.log(groups);
					res.send(groups);
				});
			}

			if(err){
				console.log(err);
				res.send(err);
			}
		});
	});*/

	return api

}