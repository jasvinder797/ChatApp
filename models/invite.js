var mongoose = require("mongoose"),
 Schema = mongoose.Schema;

 //========= user details created in the schema  ==========

var inviteSchema = new Schema({

   email: { type: String, required: true },
   token: { type: String, required: true },
   status: { type: Boolean, required: true },
   invitedby: { type: String, required: true },
   type: { type: String, required: true },
 
},{ versionKey: false });

 
var inviteUser = mongoose.model('invite', inviteSchema);

module.exports = inviteUser;