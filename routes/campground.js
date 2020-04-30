var express=require('express');
var router=express.Router({mergeParams : true});
var campground=require("../model/campground"); 

//req.user
router.get("/", function(req,res)
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
router.post("/",isLoggedIn, function(req,res) {
    var image=req.body.image;
    var name=req.body.name;
    var desc=req.body.description;
    var author={
        id:  req.user._id,
        username: req.user.username
    };
    var price=req.body.price
    var newImg={name:name ,image:image,description:desc, author:author, price:price};
    
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
router.get("/new", isLoggedIn ,function(req,res){
    res.render("campground/new"); 
});
router.get("/:id",function(req,res){
    campground.findById(req.params.id).populate("comments").exec( function(err,foundCampground)
    {
        if(err)
        console.log(err);
        else{
            console.log(foundCampground);
            res.render("campground/show",{campground: foundCampground});
        }
    });
});


//Edit campground route
router.get("/:id/edit", checkCampgroundOwnership, function(req,res){
 
        campground.findById(req.params.id, function(err,foundCampground){
            
                    res.render("campground/edit",{campground:foundCampground});
                 
           
        })  ;


});
//Update campground route
router.put("/:id",checkCampgroundOwnership,function(req,res){
    //find and update and redirect
    campground.findByIdAndUpdate(req.params.id,req.body.camp, function(err,updated){
      
        res.redirect("/campgrounds/" + req.params.id );
       
    });
});

//destroy
router.delete("/:id",checkCampgroundOwnership,function(req,res){
    campground.findByIdAndRemove(req.params.id,function(err){
        if(err)
        {
            res.redirect("/campgrounds");
        }
        else
        {
        res.redirect("/campgrounds");
        }
    })
})

//middleware
//middleware

function checkCampgroundOwnership(req,res,next)
{
     //is user logged in?
   
    //otherwise,redirect 
    if(req.isAuthenticated())
    {
        campground.findById(req.params.id, function(err,foundCampground){
            if(err)
            {
                req.flash("error","Campground not found"); 
                res.redirect("back");
            }
            else
            {
                 //does user own campground?
                  if(foundCampground.author.id.equals(req.user._id)){
                    next();
                  }
                  else{
                    req.flash("error","You don't have permission to do that");
                      res.redirect("back");
                  }
            
            }
        })  ;
}
else{
    req.flash("error","You need to be logged in to do that!");   
    res.redirect("back");
}

}

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error" , "You need to be logged in to do that!");
    res.redirect("/login");
}

module.exports=router;