var express = require("express");
var app = express();
var message = "";
var name = "";
var email = "";
var contributions = [];
var setserver = true;
var username = "";
var password = "";
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded());

app.set("view engine","ejs");

app.get("/admin",function(req,res,next){
    if(setserver === true){
        res.render("admin.ejs");
    }
    else{
        message = "please restart your server to access admin page";
        res.redirect("/login");
        next();
    }
});
app.post("/admin",function(req,res,next){
    if(setserver === true){
        setserver = false;
        username = req.body.username;
        password = req.body.password;
    }
    res.redirect("/login");
    next();
});
app.get("/",function(req,res,next){
    res.redirect("/admin");
    next();
});

app.get("/profile",function(req,res,next){
    if(setserver === true)
    {
        res.redirect("/admin");
        next();
    }
    if(email == ""){
        message = "login session expired";
        res.redirect("/login")
        next
    }
    else{
        let xn = name;
        console.log(name);
        console.log(xn);
        name = "";
        let xe = email;
        email = "";
        res.render("profile.ejs",{name : xn,email : xe,contributions : contributions});
    }
});

app.get("/login",function(req,res,next){
    if(setserver === true)
    {
        res.redirect("/admin");
        next();
    }
    let x = message;
    message = "";
    res.render("login.ejs",{message : x});
});

app.get("/signup",function(req,res,next){
    if(setserver === true)
    {
        res.redirect("/admin");
        next();
    }
    let x = message;
    message = "";
    res.render("signup.ejs",{message:x});
});

app.get("/forgotpassword",function(req,res,next){
    if(setserver === true)
    {
        res.redirect("/admin");
        next();
    }
    let x = message;
    message = "";
    res.render("forgotpassword.ejs",{message:x});
});

app.post("/forgotpassword",function(req,res,next){
    if(req.body.password == req.body.confirmpassword){
        sql = "select email,security from USER where email=?";
        var mysql = require("mysql");
        connect = mysql.createConnection({
        host : 'localhost',
        user : username,
        password: password,
        database: 'SEAug2019'
        });
        connect.connect(function(error){
            if(error){
                console.log(error);
            res.send("error while connecting database");
            }
            console.log("connected with the database");
        });
        connect.query(sql,[req.body.email],function(error,result,fields){
            if(error)
            {
                res.send("error in server");
            }
            if(result.length == 0){
                message = "account doesn't exist";
                res.redirect("/signup")
                next
            }
            else{
                    if(result[0].security !== req.body.security){
                        message = "answer security question corectly";
                        res.redirect("/forgotpassword")
                        next
                    }
                    else{
                        sql1 = "UPDATE USER SET password = ? WHERE email = ?;";
                        connect.query(sql1,[req.body.password , req.body.email],function(error,result,fields){
                        if(error)
                        {
                            res.send("error in server while updating database");
                        }
                        message = "password is succefully changed";
                        res.redirect("/login")
                        next
                    });
                    }
            }
        });
    }
    else{
        message = "passwords didnot matched";
        res.redirect("/forgotpassword")
        next
    }
});

app.post("/signup",function(req,res,next){
    var mysql = require('mysql');
    var connect = mysql.createConnection({
        host : 'localhost',
        user : username,
        password: password,
        database: 'SEAug2019'
    });
    connect.connect(function(err){
        if(err){
            console.log("error while connecting to database : ",err);
            res.send("unable to connect database :( sorry");
        }
        console.log("connected to the database!!!!");
    });
    connect.query("insert into USER (name,email,password,security) values (?,?,?,?)",[req.body.name,req.body.email,req.body.password,req.body.security],function(error,result,feilds){
        if(error){
            if(error.code == "ER_DUP_ENTRY")
            {
                message = "account already exist";
                res.redirect("/login")
                next
            }
            console.log("error while creating user account",error);
        }
        else if(result.serverStatus == 2)
        {
            message = "account is created";
            res.redirect("/login")
            next
        }
    });
});

app.post("/login",function(req,res,next){
    var mysql = require('mysql');
    var connect = mysql.createConnection({
        host : 'localhost',
        user : username,
        password: password,
        database: 'SEAug2019'
    });
    connect.connect(function(err){
        if(err){
            console.log("error while connecting to database : ",err);
        }
        console.log("connected to the database!!!!");
    });
    console.log(req.body.email);
    console.log(req.body.password);
    connect.query("select name,email , password from USER where email=? and password=?;",[req.body.email,req.body.password],function(error,result,feilds){
        if(error){
            console.log("error while creating user account",error);
            res.send("unexpected error in server :( sorry");
        }
        if(result.length == 0){
            message = "account doesn't exist";
            res.redirect("/login")
            next
        }
        else{
            name = result[0].name;
            console.log(result.name);
            email = result[0].email;
            //contributioss
            res.redirect("/profile")
            next
        }
    });
});

app.listen(3000 , function(){
    console.log("server is started!!!! ");
} );
