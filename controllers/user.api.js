var express = require("express"),
router = express.Router(),
user = require("../models/user.js"),
inviteUser = require("../models/invite.js");
var hat = require('hat');
//var serverpath="http://localhost:8000/"
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '',
    pass: ''
  }
});
router.post("/register", function(req, res) {
   
    var obj = new Object();
    obj.pass = req.body.pass;
    obj.name = req.body.name;
    obj.phone = req.body.phone;
    obj.token = hat();
    obj.active = false;
   console.log(obj.name)
    var myquery = { token:  req.body.token};
    inviteUser.findOne(myquery,function(err, result){
       if(err){
            res.send('Record fetching failed');
        }
        else if(result){
             console.log(result.email)
            obj.email = result.email;
            if(result.type=="Admin"){
                obj.admin = true;
            }
            else{
                obj.admin = false;
            }
            var myquery1 = { email: obj.email};
            user.findOne(myquery1,function(err, result){
               if(err){
                    res.send('Record fetching failed');
                }
                else if(result){
                     res.send('User with '+obj.email+' already registered. Please Login!'); 
                }
                else if(!result){
                      var model = new user(obj);
                        model.save(function(err) {
                            if (err) {
                            res.json({ success: false, message: 'Failed to register user', error:err});
                            return;
                        }
                        else{
                            var path = "https://localhost:8000/everify.html?id="+obj.token;
                            var mailOptions = {
                              from: 'youremail@gmail.com',
                              to: obj.email,
                              subject: "Email verification require",
                              text: 'That was easy!',
                              html:'<p>Please click below the link</p><a href="'+path+'">Verify Email</a>'
                            };

                            transporter.sendMail(mailOptions, function(error, info){
                              if (error) {
                                console.log(error);
                              } else {
                                console.log('Email sent: ' + info.response);
                                res.send('Account created please check your email for verification' );
                              }
                            });
                        }                
                     })
                }
            })
        }
     })
})

router.post("/login", function(req, res) {
    var eml = req.body.email;
    var pss = req.body.pass;
    //var myquery = {pass: pss};
    var myquery = {email: eml,pass: pss};
    
    console.log(pss);
    user.findOne(myquery,function(err, result){
       if(err){
           console.log(err);
            res.json({ success: false, message: err });
        }
        else if(result){
            if(!result.active){
               // console.log("dkkjd")
                res.json({ success: false, message: 'You have not verified your account. Please check your email for verification link' });
            }
            else{
                var resUser = new Object();
                resUser.name = result.name;
                resUser.admin = result.admin;
                resUser.email = result.email;
                res.json({ success: true, message: 'Login Successfull', data: resUser});
            }
        }
        else{
              res.json({ success: false, message: 'Login failed'});
        }
     })
})
router.get("/", function(req, res) {

     user.find(function(err, result){
       if(err){
        res.json({ success: false, message: 'Data fetch failed' });
       }
       else{
           console.log(result.length)
        res.status(200);
           var resultArr=[];
           for(var i = 0;i<result.length;i++)
               {
                   var obj = new Object();
                   obj.name = result[i].name;
                   obj.email = result[i].email;
                   obj.phone = result[i].phone;
                   obj.admin = result[i].admin;
                   obj.id = result[i].id;
                    resultArr.push(obj);
                   console.log(result[i].name)
                   
               }
        res.json({ success: true, data: resultArr });
       }
     })

})
router.get("/:id", function(req, res) {
    var id = req.param("id");
    console.log(id)
    var myquery = { _id:  id};
    user.findOne(myquery,function(err, result){
       if(err){
            res.json({ message: 'Record fetching failed' });
       }
       else{
            res.status(200);
            res.send(result);
       }
     })

})
router.delete("/:id", function(req, res) {

    var id = req.param("id");

    console.log(id)
    var myquery = { _id:  id};
    user.findOneAndRemove(myquery,function(err){
       if(err){
        res.json({ success: false, message: 'Record deletion failed' });
       }
       else{
        
        res.json({ success: true, data: "Record deleted successfully" });
       }
     })

})
router.put("/:id", function(req, res) {
    var id = req.param("id");
    console.log(id)
    var myquery = { token:  id};
    user.findOneAndUpdate(myquery,{ $set: { active : true }},{new: true},function(err, result){
       if(err){
            res.json({ success: false, message: err});
        }
       else{
           result.active = true;
           result.save(function(err) {
                if (err){
                    res.json({ success: false, message: err});
                }  
               else{
                   res.status(200);
                    res.json({ success: true, data: "Record updated successfully" });
               }
           });
           
       }
     })

})
module.exports = router;