

//exports.interest = function(req, res){
 // res.render('editInterest');
//};
exports.interest = function(req, res){
	//global.userID=req.body.userID;
	//show_user_info(res,userID);
	show_user_info(res,userID,false);

};
exports.editInfo = function(req, res){
	//global.userID=req.body.userID;
	editInformation(res,userID,req.body.interest);

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

function show_user_info(res,userID,fail) {
	var intPageNum;
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	var query="SELECT Interest  FROM Interests WHERE Interests.login = '" +  userID + 
	  			"' ";
	    	
		  	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	if (fail == false)
		  	    		{
		  	    	renderEditpage(res,results);
		  	    		}	
		  	    	else
		  	    	{
		  	    	 renderFail(res,results);
		  	    	}
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	}

function editInformation(res,userID,interest) {
	var intPageNum;
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	var query="SELECT Interest  FROM Interests WHERE Interests.interest = '" +  interest + 
	  			"' AND Interests.login = '" + userID + "' ";
	    	
		  	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	if (results[0] == null )
		  	    		{
		  	    		insertData(res,userID,interest);
		  	    		}
		  	    	else
		  	    		{
		  	    		console.log("Interest already exists")
		  	    		fail = true;
		  	    		show_user_info(res,userID,fail);
		  	    		}
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	}

function renderEditpage(res, results) {
	res.render('editInterest',
		   {
			fail: fail = false,
			results: results }
	  );
}

function renderFail(res,results) {
	res.render('editInterest',
		   {
			results: results,
			fail: fail = true }
	  );
}

function 	insertData(res,userID,interest) {
	var intPageNum;
	console.log(userID,interest);
	  oracle.connect(connectData, function(err, connection) {
		  
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	
	    	var query="INSERT INTO Interests (login, interest) VALUES ('"+ userID +
	  			"',  '" + interest + "' ) ";
		  	connection.execute(query, 
		  			   [], 
		  			   function(err,results) {
		  	    if ( err ) {
		  	    	
		  	    	console.log(err);

		  	    } else {
		  	    	console.log("Query Executed")
		  	    	connection.close(); // done with the connection
		  	    	fail = false;
		  	    	console.log("Inserted Correctly");
		  	    	show_user_info(res,userID,fail);
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
}


