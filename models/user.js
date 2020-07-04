var mongoose  = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
	uid: String,
	listToBeSent: {type: Array, "default": []},
	referencepoints: [{
		lat: String,
		long: String
	}],
	totalCovid: {type: Array, "default": []}
});

module.exports = mongoose.model("User", UserSchema);