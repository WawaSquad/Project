


exports.editUserPage = function(req, res){
	//global.userID=req.body.userID;
	//show_user_info(res,userID);
	show_user_info(res,userID);

};
exports.editInfo = function(req, res){
	//global.userID=req.body.userID;
	editInformation(res,userID,req.body.email,req.body.givenname,req.body.affiliation,req.body.surname);

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

function show_user_info(res,userID) {
	var intPageNum;
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	var query="SELECT *  FROM Users WHERE Users.login = '" +  userID + 
	  			"' ";
	    	
		  	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	renderEditpage(res,results);
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	}

function renderEditpage(res, results) {
	res.render('editUserPage',
		   {
			results: results }
	  );
}

function 	editInformation(res,userID,email,givenname,affiliation,surname) {
	var intPageNum;
	console.log(email,givenname,affiliation,surname);
	console.log(userID);
	  oracle.connect(connectData, function(err, connection) {
		  
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	
	    	var query="UPDATE Users SET  email = '"+ email +
	  			"', affiliation = '" + affiliation + "', surname = '"+ surname +
	  	
	  			"', givenname = '" + givenname +"' WHERE   Users.login=  '" +  userID + "' ";
		  	connection.execute(query, 
		  			   [], 
		  			   function(err,results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	console.log("Query Executed")
		  	    	connection.close(); // done with the connection
		  	    	renderUser(res,userID);
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
}

function renderUser(res,userID) {
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {

	    	var query="SELECT *  FROM Users WHERE Users.login = '" +  userID + 
	  			"' ";
	    	
		  	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	loadPage(res,results);
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	}
function loadPage(res,results) {
	res.render('userPage',
		  {
		  results: results

			}	
	
	  );
}