

//exports.login = function(req, res){
//	  res.render('login');
	//};


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
	  			"' AND Users.password = '"+ password+"' ";
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
							console.log("No User Found")
							fail = true;
							results_fail(res,fail)
							}
						else
							{
							fail = false;
							console.log("Login Sucess")
							global.userID = userID;

							output_results(res,userID,password,results);


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
	
	exports.login = function(req, res){
		query_db(res,req.body.userID,req.body.password);
	};
	
	
	function results_fail(res,fail) {
		res.render('signin',
			  {
		      fail: fail
	
				}	
		
		  );
	}

//var rec = require(recomendaiton);
	
	//function output(){
	//	rec.recomendation();
	//}
	

	function output_results(res,userID,password,results) {
		res.render('userPage',
			  {
		      userID: "userID found" + userID,
			  password: "password found" + password,
			  results: results
	
				}	
		
		  );
	}

;