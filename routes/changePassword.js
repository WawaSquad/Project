


exports.changePassword = function(req, res){
	//global.userID=req.body.userID;
	//show_user_info(res,userID);
	loadPage(res,userID);

};

//var loadUserpage = "./userPage.js";
exports.editPassword = function(req, res){
	//global.userID=req.body.userID;
	editInformation(res,userID,req.body.pass1,req.body.pass2);

};

require('./userPage');
//var userPage = require(userPage);

var connectData = { 
  "hostname": "cis550project.cumzrn1o3hle.us-west-2.rds.amazonaws.com", 
  "user": "wawa", 
  "password": "cis550",
  "port" : "1521",
  "database": "PENNTR" };
var oracle =  require("oracle");



function loadPage(res, results) {
	res.render('changePassword',
		{
	error: error = false,
	changed: changed = false
		}
	  );
}


function loadChange(res, results) {
	res.render('changePassword',
		{
	error: error = false,
	changed: changed = true
		}
	  );
}

var bcrypt = require('bcrypt');

function 	editInformation(res,userID,pass1,pass2) {
	
	
	if (pass1 == pass2)
	{
	
	
	pass1 = pass1.replace(/\s/g, '');

	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(pass1, salt);
	
	var intPageNum;
	console.log(userID);
	  oracle.connect(connectData, function(err, connection) {
		  
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	
	    	var query="UPDATE Users SET  password = '"+ hash +"' WHERE   Users.login=  '" +  userID + "' ";
		  	connection.execute(query, 
		  			   [], 
		  			   function(err,results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	console.log("Query Executed")
		  	    	connection.close(); // done with the connection
		  	    	console.log("loading user page");
		  	  	loadChange(res, results);
		  	  	console.log("Password Changed:" + pass1);
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect

	}
	else
	{
		
		res.render('changePassword',
				{
				error: error = true
				}
		  );
	}

	
}


