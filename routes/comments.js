var express = require("express");
var router = express.Router({mergeParams: true});
var Event = require("../models/event");
var Comment  = require("../models/comment");
var middleware = require("../middleware");


//comments new
router.get("/new", middleware.isLoggedIn, function(req, res){
  Event.findById(req.params.id, function(err,event){
    if(err){
      console.log(err);
    }
    else{ 
        res.render("comments/new", {event: event}); 
    }
  });

});

// comments create
router.post("/", middleware.isLoggedIn, function(req, res){
  Event.findById(req.params.id,function(err,event){
    if(err){
      console.log(err);
      res.redirect("/events");
    }
    else{
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err);
        }
        else{
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username= req.user.username;
          //save comment
          comment.save();
          event.comments.push(comment);
          event.save();
          console.log(comment);
          req.flash("success", "Successfully added a comment");
          res.redirect("/events/" + event._id);
        }
      });
    }
  });
});

//update route
router.get("/:comment_id/edit", middleware.checkCommentAuthorisation, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){
      res.redirect("back");
    }
    res.render("comments/edit", {event_id: req.params.id, comment: foundComment});   
  });
});

//logic Update route
router.put("/:comment_id", middleware.checkCommentAuthorisation, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          req.flash("success", "Successfully edited the comment");
          res.redirect("/events/" + req.params.id );
      }
   });
});


//logic destroy route
router.delete("/:comment_id", middleware.checkCommentAuthorisation, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err, deletedComment){
      if(err){
        res.redirect("/events");
      }
      else{
        req.flash("success", "Successfully deleted the comment");
        res.redirect("/events"); 
      }
    });
}); 

module.exports = router;