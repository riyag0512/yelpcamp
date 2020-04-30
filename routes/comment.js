var express=require('express');
var router=express.Router({mergeParams : true});
var campground=require("../model/campground");
var Comment=require("../model/comment");
 
router.get("/new", isLoggedIn ,function(req,res){
    campground.findById(req.params.id,function(err,campground){
        if(err)
        console.log(err);
        else
        
        res.render("comment/new",{campground: campground});
    });
   
});
//Is logged in inside comments
router.post("/",isLoggedIn ,function(req,res){
campground.findById(req.params.id,function(err,campground){
    if(err)
    {
        console.log(err);
        res.redirect("/campgrounds");
    }
    else{
        Comment.create(req.body.comment,function(err,comment){
            if(err)
            {
                req.flash("error","something went wrong!");
            console.log(err);
            } 
            else{
                //add useername and ifd
              comment.author.id=req.user._id;
              comment.author.username=req.user.username;

                //save comment
                comment.save();
                campground.comments.push(comment);
                campground.save();
                console.log(comment);
                req.flash("success", "Successfully added comment");
                res.redirect("/campgrounds/" +campground._id);
            }
        })

    }
});
});
//edit comments

router.get("/:comment_id/edit",checkCommentOwnership, function(req,res)
{
    campground.findById(req.params.id,function(err, foundCamp){
if(err)
console.log(err);
else{


   Comment.findById(req.params.comment_id,function(err, foundComment){
       if(err)
      {
           res.redirect("back");
      }
           else
  { 
      res.render("comment/edit",{campId: foundCamp , comment:foundComment});
  }
});
}

});
});
//comments update

router.put("/:comment_id",checkCommentOwnership, function(req,res)
{
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment, function(err,updateComment){
        if(err)
        res.redirect("back");
        else
        res.redirect("/campgrounds/" + req.params.id);
    });
});

//comment destroy
router.delete("/:comment_id",checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err)
        {
            res.redirect("back");
        }
        else{
            req.flash("success","Comment deleted");
            res.redirect("/campgrounds/" +req.params.id);
        }
    })
})

 function checkCommentOwnership(req,res,next)
{
     //is user logged in?
   
    //otherwise,redirect
    if(req.isAuthenticated())
    {
        Comment.findById(req.params.comment_id, function(err,foundComment){
            if(err)
            {
                res.redirect("back");
            }
            else
            {
                 //does user own campground?
                  if(foundComment.author.id.equals(req.user._id)){
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
    req.flash("error","You need to be logged in to do that!"); 
    res.redirect("/login");
}



module.exports=router;
