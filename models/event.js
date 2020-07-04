var mongoose = require("mongoose");

var eventSchema = new mongoose.Schema({
	uids: {type: Array, "default": []},
	
});

module.exports = mongoose.model("Event", eventSchema);