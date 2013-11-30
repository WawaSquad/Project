

	
	exports.login = function(req, res){
		query_db(res,req.body.userID,req.body.password);
	}
	var bcrypt = require('bcrypt');


//var rec = require("recommendation");

	var connectData = { 
	  "hostname": "cis550project.cumzrn1o3hle.us-west-2.rds.amazonaws.com", 
	  "user": "wawa", 
	  "password": "cis550", 
	  "database": "PENNTR" };
	var oracle =  require("oracle");

	function query_db(res,userID,password) {
		userID = userID.replace(/\s/g, '');
		password = password.replace(/\s/g, '');
		
		  oracle.connect(connectData, function(err, connection) {
		    if ( err ) {
		    	console.log(err);
		    } else {
				
		
		    	var query="SELECT Users.login, Users.password FROM Users WHERE Users.login = '" +  userID + 
	  			"' AND ROWNUM = 1 ";
			  	connection.execute(query, 
			  			   [], 
			  			   function(err, results) {
			  	    if ( err ) {
			  	    	console.log(err);
			  	    } else {
			  	    	connection.close(); // done with the connection
						console.log("Login Successful");
						console.log(results);
						//Updating the global variable
						
						
						if (results[0] == null )
							{
							console.log("No User Found");
							fail = true;
							results_fail(res,fail);
							}
						else
							{
							var res1 = res;
					    	bcrypt.compare(password, results[0].PASSWORD, function(err, res) {
					    	    
					    		 if (res == false)
								 {
					    
									console.log("User Creditials Invalid");
									fail = true;
									results_fail(res1,fail);
								 }
					    		 else
					    		{	 
							fail = false;
							console.log("Login Sucess");
							global.userID = userID;

							show_user_info(res1,userID);
					    		}
							

					    	});
					    	
					    	
					    	
							}
						
						// If result is found, autheneticate,
						// Store userName as userName. 
						//
			  	    	//output_photos(res, searchTags, PageNum,results);
			  	    }
			
			  	}); // end connection.execute
		    }
		  }); // end oracle.connect
		}

	
	function results_fail(res,fail) {
		res.render('signin',
			  {
		      fail: fail
	
				}	
		
		  );
	}

    


	
	function show_user_info(res,userID) {
		var intPageNum;
		  oracle.connect(connectData, function(err, connection) {
		    if ( err ) {
		    	console.log(err);
		    } else {

		    	var query="SELECT *  FROM Users WHERE Users.login = '" +  userID + 
		  			"'  ";
		    	
			  	connection.execute(query, 
			  			   [], 
			  			   function(err, results) {
			  	    if ( err ) {
			  	    	console.log(err);
			  	    } else {
			  	    	connection.close(); // done with the connection
			  	    	renderUserpage(res,results);
			  	    }
			
			  	}); // end connection.execute
		    }
		  }); // end oracle.connect
		}

	function renderUserpage(res, results) {
		res.render('userPage',
			   {
				results: results }
		  );
	}
