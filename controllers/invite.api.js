var express = require("express"),
router = express.Router(),
inviteUser = require("../models/invite.js"),
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
    var aeml = req.body.aemail;
    obj.email = eml;
    obj.token = hat();
    obj.status = false;
    obj.type = req.body.type;
    console.log(aeml)
   
    var myquery = { email:  aeml};
    var myquery1 = { email:  eml};
    user.findOne(myquery,function(err, result){
       if(err){
            res.json({ message: 'Record fetching failed' });
        }
        else if(result){
            obj.invitedby = result._id;
            var model = new inviteUser(obj);
            //to check if already registered.
            user.findOne(myquery1,function(err, result1){
           if(err){
                res.send(err);
            }
            else if(result1){
                res.json({ success: true, message: 'User with '+eml+' already registered', flag:false});
            }
            else{
                 //to check if invitation already.
                inviteUser.findOne(myquery1,function(err, result2){
               if(err){
                    res.send(err);
                }
                else if(result2){
                    res.json({ success: true, message: 'Invitation to '+eml+' already sent. Invite Again', flag:true});
                }
                else if (!result2){
                   
                    //saving invite

                    model.save(function(err) {
                        if (err) {
                        res.json({ success: false, message: 'Failed to invite user', error:err});
                        return;
                    }
                    else{
                        var path = "https://localhost:8000/register.html?id="+model.token;
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
                                res.json({ success: true, message: 'Invitation to '+eml+' send successfully', flag:false});
                              console.log('Email sent: ' + info.response);
                          }
                        });
                    }                
                 }) 
                }
             })
            }
         })
       
        }
       else{
            
       }
     })
})
router.post("/resend", function(req, res) {
    var email = req.body.email;
    var myquery = { email:  email};
    inviteUser.findOne(myquery,function(err, result){
        if(err){
             res.send(err);
         }
         else if(result){
            var path = "https://localhost:8000/register.html?id="+result.token;
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
                res.send('Confirmation email send successfully');
              }
            });
         }
    })
   
})
router.get("/:id", function(req, res) {
    var id = req.param("id");
    console.log(id)
    var myquery = { token:  id};
    inviteUser.findOne(myquery,function(err, result){
       if(err){
            res.send('Record fetching failed');
       }
       else{
            res.status(200);
            res.send(result.email);
       }
     })

})
module.exports = router;