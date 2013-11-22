
//require('/routers/recommendation.js');
//recommendations.query_db_recommendation();
exports.signin = function(req, res){
  verify(res,req.query.userID);
  //recommendations.query_db_recommendation();
  res.render('userPage');
};


var verify=function(userID_passIn){
	Users.userID=userID_PassIn;
};

