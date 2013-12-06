


exports.friend= function(req, res){
	
	console.log("friendID in /friend "+req.query.friendID);
	//console.log("srcID in /tag "+srcID);
	show_friend_info(res,false);

};

exports.editInfo = function(req, res){
	
	console.log("tag entered "+req.query.friendID);
	checkValidID(res, req.query.friendID);

};

//require('./userPage');
//var userPage = require(userPage);

var connectData = { 
  "hostname": "cis550project.cumzrn1o3hle.us-west-2.rds.amazonaws.com", 
  "user": "wawa", 
  "password": "cis550",
  "port" : "1521",
  "database": "PENNTR" };
var oracle =  require("oracle");

function show_friend_info(res,fail) {
	  
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	var query="SELECT friendID  FROM FriendShip WHERE FriendShip.login = '" + userID + 
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

function editInformation(res,friendID) {
	//var intPageNum;
	console.log("friendID in editinfo "+friendID);
	 
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	var query="SELECT friendID  FROM FriendShip WHERE FriendShip.login = '" + userID+ 
	  			"' and friendID='"+friendID+"' ";
	    	
		  	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	if (results[0] == null )
		  	    		{
		  	    		insertData(res,friendID);
		  	    		}
		  	    	else
		  	    		{
		  	    		console.log("Friend already exists")
		  	    		fail = true;
		  	    		show_friend_info(res,fail);
		  	    		}
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	}

function renderEditpage(res, results) {
	
	res.render('addFriend',
		   {
			fail: fail = false,
			results: results
			}
	  );
}

function renderFail(res,results) {
	
	res.render('addFriend',
		   {
			results: results,
			fail: fail = true
			}
	  );
}

function checkValidID(res,friendID){
	console.log(userID, friendID);
	  oracle.connect(connectData, function(err, connection) {
		  
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	
	    	var query="SELECT * FROM Users Where login='"+friendID+"'";
		  	connection.execute(query, 
		  			   [], 
		  			   function(err,results) {
		  	    if ( err ) {
		  	    	
		  	    	console.log(err);

		  	    } else {
		  	    	if (results[0] == null )
	  	    		{
		  	    		console.log("Invalid friendID")
		  	    		fail = true;
		  	    		show_friend_info(res,fail);
	  	    		}
		  	    	else
	  	    		{
		  	    		editInformation(res,friendID);
	  	    		}
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
}


function insertData(res,friendID) {
	//var intPageNum;
	console.log(userID, friendID);
	  oracle.connect(connectData, function(err, connection) {
		  
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	
	    	var query="INSERT INTO FriendShip (login, friendID) VALUES ('"+ userID +
	  			"',  '" + friendID + "' ) ";
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
		  	    	show_friend_info(res,fail);
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
}


