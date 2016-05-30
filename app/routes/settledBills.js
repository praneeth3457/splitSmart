var Settled = require('../schemas/settledBills');
var Group = require('../schemas/groups');
var User = require('../schemas/user');

var config = require('../../config');

var secretKey = config.secretKey;

module.exports = function(app, express) {

	var api = express.Router();

	api.post('/settled', function(req, res) {
		Group.findOne({gname:req.body.group}, function(err, groupUser) {
			if(groupUser){
				groupUser.gbills = [];
				groupUser.save(function(er, success){
					if(success){
						Settled.findOne({group:req.body.group}, function(err, found){
							if(found){
								Settled.findByIdAndUpdate(
								    found._id,
								    {$push: {"bills": { $each: req.body.bills}}},
								    {safe: true, upsert: true},
								    function(err, model) {
								    }
								);
								found.save(function(error) {
									if(err) {
										res.send({message: 'Unsuccess', 'error':error});
										return;
									}

									res.json({message: 'Success'});
								});
							}else if(err){
								res.send({message: 'Unsuccess', error:err});
								return;
							}else{

								/*Settled.update(found, {$addToSet : {group: req.body.group, gbills: { $each: req.body.bills}}}, function(error, inserted){
									if(inserted){
										res.json({message: 'Success'});
									}
									if(error){
										res.send({message: 'Unsuccess', error:error});
									}
								});*/
								var settledGroup = new Settled({
									group: req.body.group,
									gbills: req.body.bills
								});
								settledGroup.save(function(error) {
									if(error) {
										res.send({message: 'Unsuccess', error:error});
										return;
									}

									Settled.findOne({group:req.body.group}, function(err, Add){
										Settled.findByIdAndUpdate(
										    Add._id,
										    {$push: {"bills": { $each: req.body.bills}}},
										    {safe: true, upsert: true},
										    function(err, model) {
										    }
										);
										Add.save(function(error) {
											if(err) {
												res.send({message: 'Unsuccess', 'error':error});
												return;
											}

											res.json({message: 'Success'});
										});
									});
								});
							}
						});
					}

					if(er){
						res.send({message:'unsuccess', error:er});
					}
				})
			}else{
				res.send({message:'unsuccess'});
			}
		})
	});

	return api
}