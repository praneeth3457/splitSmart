var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var GroupSchema = new Schema({
	gname: {type: String, required: true},
	gtype: {type: String, required: true},
	gmembers: [{ name: {type: String},
				 username: {type: String, index:{unique: true}}
				}],
	gbills: [{ user: {type: String}, billFor : {type: Array}, 
				desciption: {type: String}, date: {type:Date},
				amount: {type:Number}, perPerson: {type:Number}
			}]
});

module.exports =  mongoose.model('Group', GroupSchema);