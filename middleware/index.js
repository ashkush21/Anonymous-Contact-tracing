var Event = require("../models/event");
var Comment = require("../models/comment");

var middlewareObject = {};

middlewareObject.checkEventOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Event.findById(req.params.id, function(err, foundEvent){
			if(err){
        req.flash("error", "Event not found!");
				res.redirect("/events");
			}
			else{
				if(foundEvent.author.id.equals(req.user._id)){
					next();
				}
				else{
          req.flash("error", "You dont have permission to do that")
					res.redirect("back");
				}
			}
		});	
	}
	else{
    req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
};


middlewareObject.checkCommentAuthorisation = function(req, res, next){
  if(req.isAuthenticated()){
      Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
          res.redirect("back");
        }
        else{
          if(foundComment.author.id.equals(req.user._id)){
            next();
          }
          else{
            res.redirect("back");
          }
        }
      });
  }
  else{
    res.redirect("back");
  }
};

middlewareObject.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "You need to be logged in to do that");
  res.redirect("/login");
};



module.exports = middlewareObject;