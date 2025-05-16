//Set a time interval in a page
window.setInterval(function(){time()},1000);

function time(){
    var d=new Date();
    var t=document.getElementById("time");
    var date=d.getDate();
    var month=d.getMonth()+1;
    var year=d.getFullYear();
    t.innerHTML=zero(date)+"/"+zero(month)+"/"+year+" 📅<br>"+zero(d.getHours())+" : "+zero(d.getMinutes())+" : "+zero(d.getSeconds())+"  ⏳";
}

function zero(a){
    if(a<10)
        return "0"+a;
    else
        return a;
}
//logout page
function logout(){
    $(".hide").html("Click this button to logout <br><form action='/logout'><button>Log out</button></form>");
}

//Display the profile page 
function registerd(n,r,a,g,e,p,pw){
    $(".hide").html("<hr><h3><table width=450  cellpadding=2 cellspacing=2><tr><th>Name</th><td>"+n+"</td></tr><tr><th>Login id</th><td>"+r+"</td></tr><tr><th>Age</th><td>"+a+"</td></tr><tr><th>Gender</th><td>"+g+"</td></tr><tr><th>Email</th><td>"+e+"</td></tr><tr><th>Phone no</th><td>"+p+"</td></tr></table></h3><hr>");
}

//Display the train ticket history
function traind(a){
    var xml=new XMLHttpRequest();
    xml.open("GET","User.json",true);
    xml.send();
    var z,x=0;
    xml.onreadystatechange=function(){
        $("#train").html("");
        if(xml.readyState==4 && xml.status==200){
            var b=xml.responseText;
            z=JSON.parse(b);
        if(a.length){
            for(var i=0;i<a.length;i++){
                if(a[i].logid==z.regno) {
                    $("#train").append("<hr><table width=400  cellpadding=5 cellspacing=5><tr><th>Ticket Id</th><td>"+a[i].ticket+"</td></tr><tr><th>From</th><td>"+a[i].source+"</td></tr><tr><th>To</th><td>"+a[i].destination+"</td></tr><tr><th>Journey Date</th><td>"+(a[i].journey).substr(0,10)+"</td></tr><tr><th>No of Passengers</th><td>"+a[i].passenger+"</td></tr><tr><th>Amount</th><td>"+a[i].price+"</td></tr><tr><th>Status</th><td class=can>"+a[i].status+"</td></tr></table><hr>");
                    x=1;
                }
            }
        }
        else if(a.logid==z.regno){
            $("#train").append("<hr><table width=400  cellpadding=5 cellspacing=5><tr><th>Ticket Id</th><td>"+a.ticket+"</td></tr><tr><th>From</th><td>"+a.source+"</td></tr><tr><th>To</th><td>"+a.destination+"</td></tr><tr><th>Journey Date</th><td>"+a.journey.substr(0,10)+"</td></tr><tr><th>No of Passengers</th><td>"+a.passenger+"</td></tr><tr><th>Amount</th><td>"+a.price+"</td></tr><tr><th>Status</th><td class=can>"+a.status+"</td></tr></table><hr>");
            x=1;
        } 
        if(x==0)
            $("#train").html("No train ticket found");
        }
    }
}

//Display the platform ticket history
function platd(a){
    var xml=new XMLHttpRequest();
    xml.open("GET","User.json",true);
    xml.send();
    var z,x=0;
    xml.onreadystatechange=function(){
        $("#platform").html("");
        if(xml.readyState==4 && xml.status==200){
            var b=xml.responseText;
            z=JSON.parse(b);
        if(a.length){
            for(var i=0;i<a.length;i++){
                if(a[i].log==z.regno){
                    $("#platform").append("<hr><table width=400 cellpadding=5 cellspacing=5><tr><th>Ticket no</th><td>"+a[i].tno+"</td></tr><tr><th>Station name</th><td>"+a[i].station+"</td></tr><tr><th>No of Passenger</th><td>"+a[i].ticket+"</td></tr><tr><th>Amount</th><td>"+a[i].price+"</td></tr><tr><th >Status</th><td class=status>"+a[i].status+"</td></tr></table><hr>");
                    x=1;
                } 
            }
        }
        else if(a.log==z.regno){
            $("#platform").append("<hr><table width=400 cellpadding=5 cellspacing=5><tr><th>Ticket no</th><td>"+a.tno+"</td></tr><tr><th>Station name</th><td>"+a.station+"</td></tr><tr><th>No of Passenger</th><td>"+a.ticket+"</td></tr><tr><th>Amount</th><td>"+a.price+"</td></tr><tr><th >Status</th><td class=status>"+a.status+"</td></tr></table><hr>");
            x=1;
        }
        if(x==0)    
            $("#platform").html("No platform ticket found");
        }
    }
}

//To check the user data is valid or not
function rcheck(){
    var xy=0;
    var n=document.getElementById("rname").value;
    var a=document.getElementById("rage").value;
    var g=document.getElementById("rgender").value;
    var e=document.getElementById("rmail").value;
    var p=document.getElementById("rphone").value;
    var pw=document.getElementById("rpass").value;
    var z=document.getElementById("reg");
    if(validname(n)&&validphone(p)&&validpass(pw)){}
    else
        z.innerHTML="<h3>Given data is wrong<br>Please Register again</h3><br><a href='register.html'>Register</a>";
}

// To check the booking train ticket details
function tcheck(e) {
    e.preventDefault();
    var ss = document.getElementById("sstation").value;
    var ds = document.getElementById("dstation").value;
    var price = document.getElementById("amount").value;
    var da = confirm("Pay the amount " + price + " rupees");
    if (da) {
        var a = parseInt(prompt("Pay the amount : " +price + " rupees"));
        if (a == price) {
            alert("Ticket booked successfully");
            var f = document.getElementById("ttform");
            f.action="/booktrain";
            f.submit();
        }
        else
            document.getElementById("tt").innerHTML = "<p>Insufficient amount<br>Payment failed</p><button><a href = 'book_train.html'>Train Ticket</a></button>";
    }
    else 
        document.getElementById("tt").innerHTML = "<p>Payment failed</p><button><a href = 'book_train.html'>Train Ticket</a></button>";

}




//To check the booking platform ticket details
function pcheck(e) {
    e.preventDefault();
    var sn = document.getElementById("pn").value;
    var np = document.getElementById("pnop").value;
    var d = confirm("Pay the amount " + np * 10 + " rupees");
    if (d) {
        var a = parseInt(prompt("Pay the amount " + np * 10 + " rupees"));
        if (a === np * 10) {
            alert("Ticket booked successfully");
            var f = document.getElementById("ptform");
            f.action="/platform";
            f.submit();
        } else {
            document.getElementById("pt").innerHTML = "<p>Insufficient amount<br>Payment failed</p><button><a href = 'book_plat.html'>Platform Ticket</a></button>";
        }
    } else {
        document.getElementById("pt").innerHTML = "<p>Payment cancelled</p><button><a href = 'book_plat.html'>Platform Ticket</a></button>";
    }
}

//To check the cancel train ticket details
$("#cttsubmit").click(function(){
    var pnr=document.getElementById("pnr").value;
    if(pnr.match(/^[Tt\-]{3}\d{4,5}$/)){
        alert("Ticket is cancelled\nCheck it in booking history");
    }
    else
        document.getElementById("ctt").innerHTML="Given data is wrong <br>Please give data correctly";
})

//To check the cancel platform ticket details
function ptcheck(){
    var tn=document.getElementById("cpn").value;
    if(tn.match(/^[pPTt\-]{3}\d{4,5}$/)){
        alert("Ticket is cancelled\nCheck it in booking history");
    }
    else    
        document.getElementById("cpt").innerHTML="Given data is wrong<br> Please give data correctly";
}

//Get the train ticket history and send to traindisplay function
function book(){
    var xml=new XMLHttpRequest();
        xml.open("GET","Train.json",true);
        xml.send();
        xml.onreadystatechange=function(){
            if(xml.readyState==4 && xml.status==200){
                var a=xml.responseText;
                var z=JSON.parse(a);
                traind(z);
        }
    }
}

//Get the platform ticket history and send to platdisplay function
function platf(){
    var xml=new XMLHttpRequest();
    xml.open("GET","Plat.json",true);
    xml.send();
    xml.onreadystatechange=function(){
        if(xml.readyState==4 && xml.status==200){
            var a=xml.responseText;
            var z=JSON.parse(a);
            platd(z);
        }
    }
}

//Check the profile details
function cprofile(){
    var xml=new XMLHttpRequest();
        xml.open("GET","User.json",true);
        xml.send();
        xml.onreadystatechange=function(){
            if(xml.readyState==4 && xml.status==200){
                var y=xml.responseText;
                var x=JSON.parse(y);
                registerd(x.name,x.regno,x.age,x.gender,x.email,x.phone);
        }
    }  
}

//Check the valid name or not
function validname(n){
    var x=/^([a-zA-Z]\s?)+$/;
    if(n.match(x))
        return true;
    else    
        return false;
}

//Check the valid phone number or not
function validphone(n){
    var x=/^\d{10}$/;
    if(n.match(x))
        return true;
    else        
        return false;
}

//Check the valid password or not
function validpass(n){
    if(n.length>=6 && n.length<=13)
        return true;
    else    
        return false;
}

//Check the valid registered date or not
function validdate(d){
    var y=new Date();
    var x=new Date(d);
    if(y.getDate()<=x.getDate()||y.getTime()<=x.getTime())
        return true; 
    else
        return false;
}

var app=angular.module("train",[]);
app.controller("ctrl",function($scope){});

var app=angular.module("myplat",[]);
app.controller("myctrl",function($scope){
});

var app=angular.module("myreg",[]);
app.controller("myctrl",function($scope){});

var app = angular.module("book",[]);
app.controller("myctrl",function($scope){
    $scope.tnop = 1;
});