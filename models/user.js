var mongoose = require("mongoose"),
 Schema = mongoose.Schema;

 //========= user details created in the schema  ==========

var userSchema = new Schema({

   name: { type: String, required: true },
   phone: { type: String, required: true },
   email: { type: String, required: true },
   pass: { type: String, required: true },
   token: { type: String, required: true },
   active: { type: Boolean, required: true },
   admin: { type: Boolean, required: true },
 
},{ versionKey: false });

 
var user = mongoose.model('users', userSchema);

module.exports = user;