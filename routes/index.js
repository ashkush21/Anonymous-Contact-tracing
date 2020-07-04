var express = require("express");
var router = express.Router();
var passport = require("passport");
var User  = require("../models/user");
var middleware = require("../middleware");
var getmac = require("getmac");

isloggedin = false;
//root route
router.get("/", function(req, res){
  if(!isloggedin)
    res.redirect("/events");
  else
    res.redirect("/afterregister");
});



//show register form
router.get("/register", function(req, res){
  if(!isloggedin)
	 res.render("register");
  else
    res.render("./afterRegistration")
});


router.get("/afterregister", (req, res)=>{
  console.log(isloggedin)
  res.render("./afterRegistration");
})


//handle signup route
router.post("/register", function(req, res){
	// console.log(getmac.default());

  // console.log("Successfully posted")
  if(isloggedin){
    res.redirect("/afterregister");
  }
  else{
    console.log(req.body);
    console.log(isloggedin);

    let refpoint = [{
      "lat": req.body.referencePoints[0]["latitude"],
      "long": req.body.referencePoints[0]["longitude"]
    }];
    console.log(refpoint);
    let id = req.body.id;
    let listToBeSent = [];
    let covid = [];
    let newUser = new User({uid: id, listToBeSent: listToBeSent, referencepoints: refpoint, totalCovid: covid});
    User.create(newUser, (err, newcreated)=>{
      if(err){
        console.log(err);
      // console.log("error in creating user");
    }
    else{
      isloggedin = true;
      console.log("Successfully created user");
      res.redirect("/afterregister");
    }
  })

  }
  // res.render("login");
  // res.redirect("login");
	// var newUser = new User({username: getmac.default()});
	// User.register(newUser, "123", function(err, user){
	// 	if(err){
	// 		console.log(err.message);
	// 		req.flash("error", err.message);
	// 		return res.redirect("/register");
	// 	}
	// 		passport.authenticate("local")(req, res, function(){
	// 		req.flash("success", "Successfully signed up. Welcome " + user.username);	
	// 		res.redirect("/events"); 
	// 	});
	// });
});
//login route
router.get("/login", function(req, res){
	res.render("login");
});

//login logic
router.post('/login', (req, res, next) => {
 req.body.username = getmac.default();
 req.body.password = "123";
 passport.authenticate('local',
  (err, user, info) => {
  	// console.log(req.body);
  	console.log(info);
    if (err) {
    	// console.log(err.message)	
      return next(err);
    }

    if (!user) {
      return res.redirect('/login?info=' + info);
    }

    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }

      return res.redirect('/');
    });

  })(req, res, next);
});
// router.post("/login",passport.authenticate("local",
// 	// {
// 	// 	successRedirect: "/events",
// 	// 	failureRedirect: "/login",
// 	// 	failureFlash: true
// 	// }
// 	(err, user, info) => {
//     if (err) {
//       return next(err);
//     }

//     if (!user) {
//       return res.redirect('/login?info=' + info);
//     }

//     req.logIn(user, function(err) {
//       if (err) {
//         return next(err);
//       }

//       return res.redirect('/');
//     });

//   })
// 	), function(req, res){
// 	console.log("logged in Successfully")
// });


//logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/events");
}); 

module.exports = router;