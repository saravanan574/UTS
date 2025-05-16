//Define the required module
var express=require('express');
var app=express();
var bp=require('body-parser');
var fs=require('fs');
var events=require("events");
var ee=new events.EventEmitter();
var session=require('express-session');
var cp=require('cookie-parser');

//Get the directory of the page
app.use(express.static(__dirname))
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

//Configure the mongodb
var mongoose=require('mongoose');
mongoose.connect("mongodb://localhost:27017/train",{useUnifiedTopology:true,useNewUrlParser: true});

//User details
var data=new mongoose.Schema({
    regno:String,name:String,age:String,gender:String,date:Date,email:String,phone:String,password:String
})
var user=mongoose.model("user",data);

//Train ticket details
var data1=new mongoose.Schema({
    logid:String,ticket:String,source:String,destination:String,journey:Date,passenger:String,price:Number,phone:String,status:String
})
var ticket=mongoose.model("ticket",data1);

//Platform ticekt details
var data2=new mongoose.Schema({
    log:String,tno:String,station:String,ticket:String,price:Number,status:String
})
var plat=mongoose.model("plat",data2);

//Create a session
app.use(cp());
app.use(session({
    secret:"Don't see my privacy",
    cookie:{maxAge:100000},
    resave:true,
    saveUninitialized:true
}));

//Inital page of a site
app.get("/",function (req, res) {  
    fs.writeFile("n.txt",'0',function(err,data){
        if(err) throw err;
    })
    res.redirect("/log");
});

//Login page
app.get("/log",function (req, res) {
    res.sendFile(__dirname+"/login.html");
});
/*app.get("/login",function (req, res) {
    res.sendFile(__dirname+"/login.html");
});  */  

//Register page
app.get("/reg",function (req, res) {
    res.sendFile(__dirname+"/register.html");
});

//Home page
app.get("/home",function (req, res) {
    res.sendFile(__dirname+"/index.html");
});

//Booking Train ticket 
app.get("/ticket",function (req, res) {
    res.sendFile(__dirname+"/book_train.html");
});

//Cancel Train ticekt
app.get("/cticket",function (req, res) {
    res.sendFile(__dirname+"/cancel_train.html");
});

//Cancel Platform ticket
app.get("/cplat",function (req, res) {
    res.sendFile(__dirname+"/cancel_plat.html");
});

//Booking history
app.get("/history",function(req,res){
    res.sendFile(__dirname+"/history.html");
})

//Logout page
app.get("/logout",function(req,res){
    res.sendFile(__dirname+"/logout.html");
    res.redirect("/clear");
})

//Clear the data after login into the page
app.get("/clear",async(req,res)=>{
    fs.writeFile("n.txt",'0',function(err,data){
        if(err) throw err;
    })
    fs.writeFile("User.json",'',function(err,data){
        if(err) throw err;
    })
    console.log("Logged out successfully");
    res.redirect("/log");
})

//To update the user details
app.post("/register",async(req,res)=>{
    var s=Math.round(Math.random()*100000);
    var mydata=new user({
        regno:s,
        name:(req.body.rname).toUpperCase(),
        age:req.body.rage,
        gender:req.body.rgender,
        date:new Date(),
        email:req.body.rmail,
        phone:req.body.phoneno,
        password:req.body.rpass
    });

    var d=await user.updateOne({phone:req.body.phoneno,email:req.body.rmail},{$set:{phone:req.body.phoneno}});
    if(d.matchedCount==0){
        mydata.save()
        .then(item=>{console.log( mydata.name+" New user data is inserted in database "+mydata.regno);
        const r=JSON.stringify(mydata);

        fs.writeFile("User.json",r,function(err,data){
            if(err) throw err;
        })
        fs.writeFile("n.txt","1",function(err,data){
            if(err) throw err;
        })
        res.redirect("/home")
        })
    }
    else    
        res.redirect("/reg");
})

//Check the valid log in data or not
app.post("/login",async(req,res)=>{
    var p=req.body.lphone;
    var pw=req.body.lpw;
    const z=await user.findOne({phone:p,password:pw});
    if(z){
        console.log(z.name+" Logged in successfully "+z.regno);
        const r=JSON.stringify(z);

        fs.writeFile("User.json",r,function(err,data){
            if(err) throw err;
        })
        fs.writeFile("n.txt","1",function(err,data){
            if(err) throw err;
        })
        res.redirect("/home");
    }
    else{
        req.session.page_views=0;
        res.redirect("/log");
    }
})

fs.readFile("x.txt",function x(err,data){
    return data;
})

//To check the booking train ticket
app.post("/booktrain",async(req,res)=>{ 
    var s="TT-"+Math.round(Math.random()*100000);
    var a;
    fs.readFile("User.json",function x(err,data){
        var i=JSON.parse(data);
        a=i.regno; 
        var mydata1=new ticket({
        logid:a,
        ticket:s,
        source:(req.body.sstation).toUpperCase(),
        destination:(req.body.dstation).toUpperCase(),
        journey:req.body.date,
        passenger:req.body.tnop,
        price:req.body.amount,
        phone:req.body.tphoneno, 
        status:"Booked"
        });

        mydata1.save()
        .then(item=>{console.log("Train Ticket "+mydata1+" is inserted in database ");});
        res.redirect("/ptdata");
    })
})

//To get the platform ticket details
app.all("/ptdata",async(req,res)=>{
    const i=await ticket.find({}).sort({_id : -1});
    const r=JSON.stringify(i);
    fs.writeFile("Train.json",r,function(err,data){
        if(err) throw err;
    });
    const ii=await plat.find({}).sort({_id : -1});
    const rr=JSON.stringify(ii);
    fs.writeFile("Plat.json",rr,function(err,data){
        if(err) throw err;
    }) 
    res.redirect("/history");
})


//To check the platform ticket details
app.post("/platform",async(req,res)=>{
    var s="PT-"+Math.round(Math.random()*100000);
    var a;
    fs.readFile("User.json",function x(err,data){
        var i=JSON.parse(data);
        a=i.regno;
        var mydata2=new plat({
        log:a,
        tno:s,
        station:req.body.pn.toUpperCase(),
        ticket:req.body.pnop,
        price:parseInt(req.body.pnop)*10,
        status:"Booked"
    });
    mydata2.save()
    .then(item=>{console.log("Platform ticket "+mydata2+" is inserted in database ");
    });})
    res.redirect("/ptdata");
})

//Cancel the valid train ticket
app.post("/cticket",async(req,res)=>{
    var p=req.body.pnr;
    var d=await ticket.updateOne({ticket:p,status:"Booked"},{$set:{status:"Cancelled"}});
    if(d.matchedCount==1){
        console.log("Train ticket "+p+" is cancelled successfully ");
        var i=await ticket.find({});
        const r=JSON.stringify(i);
        fs.writeFile("Train.json",r,function(err,data){
            if(err) throw err;
        })
        res.redirect("/history");
    }
    else
        res.redirect("/cticket");
    
})

//Cancel the valid platform ticket
app.post("/cplatform",async(req,res)=>{
    var t=req.body.cpn;
    var d=await plat.updateOne({tno:t,status:"Booked"},{$set:{status:"Cancelled"}});
    if(d.matchedCount==1){
        console.log("Platform ticket "+t+" is cancelled successfully ");
        var i=await plat.find({})
        var r=JSON.stringify(i);
        fs.writeFile("Plat.json",r,function(err,data){
            if(err) throw err;
        ;})
        res.redirect("/history");
    }
    else
        res.redirect("/cplat");
        
})

//Run the server in port no 3000
app.listen(3000,()=>console.log("Server is running on port no 3000 "+__dirname));
