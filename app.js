	var express    = require("express"),
	app        = express(),
	bodyparser = require("body-parser"),
	mongoose   = require("mongoose"),
	Event      = require("./models/event"),
	Comment    = require("./models/comment"),
	passport   = require("passport"),
	flash	   = require("connect-flash"),	
	LocalStrategy = require("passport-local"),
	User      = require("./models/user"),
	methodOverride = require("method-override");
//requiring routes	
	var commentRoutes    = require("./routes/comments"),
		eventRoutes = require("./routes/events"),
		authRoutes       = require("./routes/index");


mongoose.connect("mongodb://localhost:27017/CSIproject", { useNewUrlParser: true });
//mongodb://<dbuser>:<dbpassword>@ds135540.mlab.com:35540/csiproject 
// mongoose.connect(
// 	"mongodb+srv://ashkush:csiproject@ashkush-wsyln.mongodb.net/csiproject?retryWrites=true",
// 	 { 
// 	 	useNewUrlParser: true 
// 	 });

app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));  
app.use(flash());	

app.locals.moment = require("moment");


//PASSPORt config
app.use(require("express-session")({
	secret: "best car lamborghini gallardo",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error	= req.flash("error");
	res.locals.success	= req.flash("success");
	next();	
});

app.use("/", authRoutes);
app.use("/events/:id/comments", commentRoutes);
app.use("/events",eventRoutes);

// app.listen(process.env.PORT, process.env.IP);
app.listen(4500, function(){
	console.log("server has started");
});