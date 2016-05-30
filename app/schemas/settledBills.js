var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var SettledSchema = new Schema({
	group: {type: String, required: true},
	bills: [{ user: {type: String}, billFor : {type: Array}, 
				desciption: {type: String}, date: {type:Date},
				amount: {type:Number}
			}]
});

module.exports =  mongoose.model('Settled', SettledSchema);