var express = require("express"),
router = express.Router(),
user = require("../models/user.js");
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
router.post("/", function(req, res) {
    
    var obj = req.body;
    var eml = req.body.email;
    obj.token = hat();
    obj.active = false;
    var model = new user(obj);
    var myquery = { email:  eml};
    user.findOne(myquery,function(err, result){
       if(err){
            res.json({ message: 'Record fetching failed' });
        }
        else if(result){
            res.json({ message: 'Account With this email already exist' });
        }
       else{
             model.save(function(err) {
                if (err) {
                res.json({ success: false, message: 'Failed to register user', error:err});
                return;
            }
            else{
                var path = "https://localhost:8000/everify.html?id="+model.token;
                var mailOptions = {
                  from: 'youremail@gmail.com',
                  to: req.body.email,
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
})

router.post("/login/", function(req, res) {
    var eml = req.body.email;
    var pss = req.body.pass;
    //var myquery = {pass: pss};
    var myquery = {email: eml,pass: pss};
    
    console.log(pss);
    user.findOne(myquery,function(err, result){
       if(err){
           console.log(err);
            res.json({ message: 'Record fetching failed' });
        }
        else if(result){
            if(!result.active){
                 res.json({ message: 'You have not verified your account. Please check your email for verification link' });
            }
        }
       else{
             res.json({ message: 'Account With this email already exist' });
       }
     })
})
router.get("/", function(req, res) {

     user.find(function(err, result){
       if(err){
        res.json({ success: false, message: 'Data fetch failed' });
       }
       else{
        res.status(200);
        res.send(result);
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