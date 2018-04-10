 var express = require('express'),
 router = express.Router();

router.use("/user", require("../controllers/user.api"));
router.use("/invite", require("../controllers/invite.api"));
 
module.exports = router;