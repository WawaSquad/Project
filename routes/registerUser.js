
// exports.login = function(req, res){
// res.render('login');
	// };

		
exports.registerUser = function(req, res){
	  
		query_db(res,req.body.userID,req.body.password);
		//query_db2(res,req.body.userID,req.body.password);
	};
	
	var connectData = { 
	  "hostname": "cis550project.cumzrn1o3hle.us-west-2.rds.amazonaws.com", 
	  "user": "wawa", 
	  "password": "cis550", 
	  "database": "PENNTR" };
	var oracle =  require("oracle");
	
	function checkInfo(res,userID,password)
	{
		//CHECK USER ID IS correct form
		//Check password is correct form
		//if Not , redirect back to register page with the error message
		
	}
	
	
	function query_db(res,userID,password) {
		userID = userID.replace(/\s/g, '');
		password =password.replace(/\s/g, '');
			console.log(userID);
			console.log(password);
			
		  oracle.connect(connectData, function(err, connection) {
			    if ( err ) {
			    	console.log(err);
			    } else {
					
			    	var query="SELECT Users.userID FROM Users WHERE Users.userID = '" +  userID + 
		  			"' ";
				  	connection.execute(query, 
				  			   [], 
				  			   function(err, results) {
				  	    if ( err ) {
				  	    	console.log(err);
				  	    } else {
				  	    	connection.close(); // done with the connection
							console.log("User Check Successful");
							console.log(results);
							//Updating the global variable
							
							
							if (results[0] == null )
								{
								console.log("No User Found`")
								query_db2(res,userID,password);
								}
							else
								{
								fail = true;
								console.log("Error: user found");
								resultFail(res,fail);
								
								

								}
							
							// If result is found, autheneticate,
							// Store userName as userName. 
							//
				  	    	//output_photos(res, searchTags, PageNum,results);
				  	    }
				
				  	}); // end connection.execute
			    }
			  }); // end oracle.connect
			};
		
	

function query_db2(res,userID,password) {
	console.log("Success: No users found");
	console.log(userID);
	console.log(password);
	 oracle.connect(connectData, function(err, connection) {
		    if ( err ) {
		    	console.log(err);
		    } 
		    else
		    	{
				
		    	var query="INSERT INTO Users (userID, password) VALUES( '" +  userID + 
	  			"'  , '"+ password+"') ";
			  	connection.execute(query, 
			  			   [], 
			  			   function(err) {
			  	    if ( err ) {
			  	    	console.log(err);
		
			  	    }
			  	    else 
			  	    {	
			  	    // For Dev
			  	    console.log("Sucessfully Inserted User");
			  	    connection.close();
			  	    success = true;
			  	    resultSuccess(res,success);
			  	    }
			  	}); // end connection.execute
			    }
			  }); // end oracle.connect
			}
function resultSuccess(res,success) {
	res.render('signin',
		  {
	      success: success,
	      fail: fail =false

			}	
	
	  );
}

	function resultFail(res,fail) {
		res.render('register',
			  {
		      fail: fail
	
				}	
		
		  );
	}
