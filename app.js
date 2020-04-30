//ADDING Authentication
var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var methodOverride=require('method-override');
var flash=require('connect-flash');
var Comment=require("./model/comment");
var campground=require("./model/campground");

var seedDB=require("./seeds");
//new added
var passport=require("passport");
var LocalStrategy=require("passport-local");
var User=require("./model/user"); 
//-------------


   // seedDB(); seed the database

mongoose.connect("mongodb://localhost/yelp_camp_v12");


app.use(bodyParser.urlencoded({extended: true})); 
app.set("view engine","ejs");  
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
//Passport configuration

app.use(flash());


app.use(require("express-session")({
   secret:"vibhu bola h",
   resave:false,
   saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//To use in all the things
app.use(function(req,res, next){
    res.locals.currentUser= req.user;
    res.locals.error=req.flash("error"); 
    res.locals.success=req.flash("success"); 
    next();
});


//router added

var commentRoutes= require("./routes/comment");
  var  campgroundRoutes=require("./routes/campground");
   var  indexRoutes=require("./routes/auth");

//-----------------------------------------------------------------


/*var campgroundSchema=new mongoose.Schema({
    name:String,
    image:String,
    description:String
});
var campground=mongoose.model("campground",campgroundSchema);
*/


/*campground.create({
    name:"Saloni",
    image:"https://images.pexels.com/photos/45241/tent-camp-night-star-45241.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    description:"HI its saloni"
});*/


/*
app.get("/",function(req,res)
{
    res.render("campground/landing");
});

//req.user
app.get("/campgrounds", function(req,res)
{
   campground.find({},function(err,allCampgrounds){
       if(err)
       {
           console.log(err);
       }
       else
       {
           
        res.render("campground/campgrounds",{campgrounds:allCampgrounds , currentUser: req.user});
       }
   });

});
app.post("/campgrounds",isLoggedIn, function(req,res) {
var image=req.body.image;
var name=req.body.name;
var desc=req.body.description;
var author={
    id:  req.user._id,
    username: req.user.username
};
var newImg={name:name ,image:image,description:desc, author:author};

campground.create(newImg,function(err,camp)
{
    if(err)
    {
        console.log(err);
    }
    else
    {
        console.log(camp);
        res.redirect("/campgrounds");
    }
});
});
app.get("/campgrounds/new", isLoggedIn ,function(req,res){
    res.render("campground/new"); 
});
app.get("/campgrounds/:id",function(req,res){
    campground.findById(req.params.id).populate("comments").exec( function(err,foundCampground)
    {
        if(err)
        console.log("there is error");
        else{
            console.log(foundCampground);
            res.render("campground/show",{campground: foundCampground});
        }
    });
});
//comments
app.get("/campgrounds/:id/comments/new", isLoggedIn ,function(req,res){
    campground.findById(req.params.id,function(err,campground){
        if(err)
        console.log(err);
        else
        
        res.render("comment/new",{campground: campground});
    })
   
});
//Is logged in inside comments
app.post("/campgrounds/:id/comments",isLoggedIn ,function(req,res){
campground.findById(req.params.id,function(err,campground){
    if(err)
    {
        console.log(err);
        res.redirect("/campgrounds");
    }
    else{
        Comment.create(req.body.comment,function(err,comment){
            if(err)
            console.log(err);
            else{
                //add useername and ifd
              comment.author.id=req.user._id;
              comment.author.username=req.user.username;

                //save comment
                comment.save();
                campground.comments.push(comment);
                campground.save();
                console.log(comment);
                campground.comments.push(comment);
                campground.save();
                res.redirect("/campgrounds/" +campground._id);
            }
        })

    }
})



})
//=================================================================
//Auth routes
//=========================

app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register",function(req,res){

    var newUser=new User({username: req.body.username}); 
    User.register(newUser, req.body.password, function(err, user){
        if(err)
        {
            console.log(err);
            return res.render("register")
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        });
    });

});


//LOGIN

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",passport.authenticate("local", 
{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),
 function(req,res){

 });


//Logout route
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/campgrounds");
});
  
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

*/
//using routes
app.use(indexRoutes);
app.use("/campgrounds" ,campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(3000, function()
{
    console.log("yelpcamp started");
});