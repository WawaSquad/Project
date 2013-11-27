
var connectData = { 
	  "hostname": "cis550project.cumzrn1o3hle.us-west-2.rds.amazonaws.com", 
	  "user": "wawa", 
	  "password": "cis550", 
	  "database": "PENNTR" };
	var oracle =  require("oracle");

	function query_db(res,boardName) {
		
		
		  oracle.connect(connectData, function(err, connection) {
		    if ( err ) {
		    	console.log(err);
		    } else {
				
		    	var query="SELECT * FROM Board WHERE Board.login = '" +  userID + 
	  			"' AND Board.name = '"+ boardName+"' ";
			  	connection.execute(query, 
			  			   [], 
			  			   function(err, results) {
			  	    if ( err ) {
			  	    	console.log(err);
			  	    } else {
			  	    	connection.close(); // done with the connection
						console.log(results);
				
						if (results[0] == null )
							{
							console.log("No Board Found")
							query_db2(res,boardName);
							}
						else
							{
							fail = true;
							console.log("Error: Board Found");
                            query_db3(res,success=false,fail);
							
							}
						
						
			  	    }
			
			  	}); // end connection.execute
		    }
		  }); // end oracle.connect
		}
	
	function query_db2(res,boardName) {
		
		 oracle.connect(connectData, function(err, connection) {
			    if ( err ) {
			    	console.log(err);
			    } 
			    else
			    	{
					
			    	var query="INSERT INTO Board (login, name) VALUES( '" +  userID + 
		  			"'  , '"+ boardName+"') ";
				  	connection.execute(query, 
				  			   [], 
				  			   function(err) {
				  	    if ( err ) {
				  	    	console.log(err);
			
				  	    }
				  	    else 
				  	    {	
				  	    // For Dev
				  	    console.log("Sucessfully Inserted Board");
				  	    connection.close();
				  	    success = true;
				  	    query_db3(res,success, fail=false);
				  	    }
				  	}); // end connection.execute
				    }
				  }); // end oracle.connect
				}
	
	
	function query_db3(res,success,fail) {
		  oracle.connect(connectData, function(err, connection) {
		    if ( err ) {
		    	console.log(err);
		    } else {
		    	var query = "SELECT name, login FROM Board WHERE " +
		    	"login = '"+userID+"'";
			  	
		    	connection.execute(query, 
			  			   [], 
			  			   function(err, results) {
			  	    if ( err ) {
			  	    	console.log(err);
			  	    } else {
			  	    	connection.close(); // done with the connection
			  	    	console.log(results);
			  	    	if(fail)
			  	    		resultFail(res,results,fail);
			  	    	if(success)
			  	    		resultSuccess(res,results,success);
			  	    	
			  	    }
			
			  	}); // end connection.execute
		    }
		  }); // end oracle.connect
		}
	
	exports.addBoard = function(req, res){
		query_db(res,req.query.NewBoardName);
	};
	
	
	function resultSuccess(res,results,success) {
		res.render('board',
			  {
		      success: success,
		      fail: fail =false,
		      results: results

				}	
		
		  );
	}

		function resultFail(res,results, fail) {
			res.render('board',
				  {
			      fail: fail,
		          success: success=false,
		          results: results
					}	
			
			  );
		}
