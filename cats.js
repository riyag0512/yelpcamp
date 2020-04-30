var mongoose=require('mongoose');
mongoose.connect("mongodb://localhost/cat_app");

var catSchema=new mongoose.Schema({
    name:String,
    age: Number,
    temperament: String
});
var  Cat=mongoose.model("Cat", catSchema);
/*var george=new Cat({ 
    name:"mrs. Norris",
    age:10,
    temperament:"grouchy"
});
george.save(function(err,cat){
    if(err)
    console.log("wrong");
    else{
        console.log("rihght");
        console.log(cat);
    }
});*///1 method
//2 method to create
Cat.create({
    name:"Snow white",
    age:15,
    temperament:"blond"
},function(err,cat)
{
    if(err)
    {
        console.log(err);
    }
    else{
        console.log(cat);
    }
});

Cat.find({},function(err,cats)
{
    if(err)
    {
        console.log(err);
    }
    else{
        console.log("correst");
        console.log(cats);
    }
});

