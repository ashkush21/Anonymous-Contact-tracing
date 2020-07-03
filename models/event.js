var mongoose = require("mongoose");

var eventSchema = new mongoose.Schema({
	name: String,	
	image: String,
	description: String,
	eventDateStart: Date,
	eventDateEnd: Date,
	societyName: String,
	venue: String,
	author: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]

});

module.exports = mongoose.model("Event", eventSchema);