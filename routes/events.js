var express 	= require("express");
var router      = express.Router();
var Event  = require("../models/event");
var middleware = require("../middleware");
var moment     = require("moment");


//root route
router.get("/", function(req, res){
		
		Event.find({}, function(err, allevents){
			if(err){
				req.flash("error", "something went wrong");
			}
			else{
				res.render("events/index", {events: allevents});	
			}
		});
});

// post route
router.post("/", middleware.isLoggedIn, function(req, res){
	var date = req.body.eventdate;
	var name = req.body.name;
	var start = req.body.eventDateStart;
	var end   = req.body.eventDateEnd;
	var image = req.body.image;
	var desc = req.body.description;
	var socName = req.body.societyName;
	var venue =  req.body.venue;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newEvent = {name: name, image: image, description: desc, author: author, societyName: socName, eventDateStart: start, eventDateEnd: end, venue: venue};	
	Event.create(newEvent, function(err, newlycreated){
		if(err){
			req.flash("error", "Error! Could not create a event");
		}
		else{
			req.flash("success", "Event created successfully");
		 res.redirect("/events");
		}
	});

});

//new route
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("events/new");
});


//show route
router.get("/:id", function(req, res){
	Event.findById(req.params.id).populate("comments").exec(function(err, foundevent){
		if(err){
			req.flash("error", "could not find the event!");
		}
		else{
			res.render("events/show", {event: foundevent});
		}
	});
});

// edit route
router.get("/:id/edit", middleware.checkEventOwnership, function(req, res){
		Event.findById(req.params.id, function(err, foundEvent){
					res.render("events/edit", {event: foundEvent});
		});								
});

//update route
router.put("/:id", middleware.checkEventOwnership, function(req, res){
	Event.findByIdAndUpdate(req.params.id, req.body.event, function(err, updatedEvent){
		if(err){
			req.flash("error", "Sorry, could not edit the event");
			res.redirect("/events");
		}
		else{
			req.flash("success", "Successfully edited the event!");
			res.redirect("/events/" + req.params.id);
		}
	});
});


//remove event
router.delete("/:id", middleware.checkEventOwnership, function(req, res){
	Event.findByIdAndRemove(req.params.id, function(err, deletedEvent){
		if(err){
			res.redirect("/events");
		}	
		else{
			req.flash("success", "Successfully deleted the event");
			res.redirect("/events");
		}
	});
});


module.exports = router;	