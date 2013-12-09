
// exports.login = function(req, res){
// res.render('login');
	// };

		
exports.registerUser = function(req, res){
	  
		query_db(res,req.body.userID,req.body.password,req.body.surname,
				req.body.givenname,req.body.email,req.body.affiliation);
		//query_db2(res,req.body.userID,req.body.password);
	};
	
	var connectData = { 
	  "hostname": "cis550project.cumzrn1o3hle.us-west-2.rds.amazonaws.com", 
	  "user": "wawa", 
	  "password": "cis550", 
	  "database": "PENNTR" };
	var oracle =  require("oracle");
	

	
	var bcrypt = require('bcrypt');
	
	function query_db(res,userID,password,surname,givenname,email,affiliation) {
		
		console.log(userID,password,surname,givenname,email,affiliation);
		userID = userID.replace(/\s/g, '');
		password =password.replace(/\s/g, '');
			console.log(userID);
			console.log(password);
			
		  oracle.connect(connectData, function(err, connection) {
			    if ( err ) {
			    	console.log(err);
			    } else {
			
			    	var query="SELECT Users.login FROM Users WHERE Users.login = '" +  userID + 
		  			"' ";
				  	connection.execute(query, 
				  			   [], 
				  			   function(err, results) {
				  	    if ( err ) {
				  	    	console.log(err);
				  	    } else {
				  	    	connection.close(); // done with the connection
							//console.log("User Check Successful");
							//console.log(results);
							//Updating the global variable
							
							
							if (results[0] == null )
								{
								console.log("No User Found`")
								 query_db2(res,userID,password,surname,givenname,email,affiliation);
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
		
	

function query_db2(res,userID,password,surname,givenname,email,affiliation) {
	console.log("Success: No users found");
	console.log(userID);
	console.log(password,surname,givenname,email,affiliation);
	 oracle.connect(connectData, function(err, connection) {
		    if ( err ) {
		    	console.log(err);
		    } 
		    else
		    	{
				
		    
		    	var salt = bcrypt.genSaltSync(10);
		    	var hash = bcrypt.hashSync(password, salt);
		 
		    	var query="INSERT INTO Users (login, password,surname,givenname,email,affiliation) VALUES( '" +  userID + 
	  			"'  , '"+ hash+"', '"+ surname+"', '"+ givenname+"', '"+ email+"', '"+ affiliation+"') ";
			  	
		    	console.log(hash);
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
	

	
	
	
