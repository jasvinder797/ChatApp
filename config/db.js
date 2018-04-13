
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//var connection = mongoose.connect('mongodb://localhost:27017/dbchat'); 
var connection = mongoose.connect('mongodb://jasvinder797:powerpack@ds237379.mlab.com:37379/chatdb'); 
module.exports = connection;