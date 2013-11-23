


exports.userPage = function(req, res){
	global.userID=req.body.userID;
	verify_transfer(res,userID,req.body.password);
    res.render('userPage');
};

var verify_transfer=function(res,userID,password){
	
};
