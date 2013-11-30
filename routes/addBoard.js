
var connectData = { 
	  "hostname": "cis550project.cumzrn1o3hle.us-west-2.rds.amazonaws.com", 
	  "user": "wawa", 
	  "password": "cis550", 
	  "database": "PENNTR" };
	var oracle =  require("oracle");

	function query_db(res,boardName,currentObjID,currentSrcID) {
		
		  console.log(currentObjID+" "+currentSrcID);
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
							query_db2(res,boardName,currentObjID,currentSrcID);
							}
						else
							{
							fail = true;
							console.log("Error: Board Found");
                            query_db3(res,success=false,fail,currentObjID,currentSrcID);
							
							}
						
						
			  	    }
			
			  	}); // end connection.execute
		    }
		  }); // end oracle.connect
		}
	
	function query_db2(res,boardName,currentObjID,currentSrcID) {
		
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
				  	  console.log(currentObjID+" "+currentSrcID);
				  	    query_db3(res,success, fail=false,currentObjID,currentSrcID);
				  	    }
				  	}); // end connection.execute
				    }
				  }); // end oracle.connect
				}
	
	
	function query_db3(res, success, fail, currentObjID, currentSrcID) {
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
			  	    		resultFail(res,results,fail, currentObjID, currentSrcID);
			  	    	if(success)
			  	    		resultSuccess(res,results,success, currentObjID, currentSrcID);
			  	    }
			
			  	}); // end connection.execute
		    }
		  }); // end oracle.connect
		}
	
	/*
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
	*/
	
	exports.addBoard = function(req, res){
		query_db(res,req.query.NewBoardName,req.query.currentObjID,req.query.currentSrcID);
	};
	
	
	function resultSuccess(res,results,success,currentObjID, currentSrcID) {
		console.log("render ID success:"+ currentObjID+" "+currentSrcID);
		res.render('pin_it',
			  {
		      success: success,
		      fail: fail =false,
		      currentObjID: currentObjID,
			  currentSrcID: currentSrcID,
		      results: results

				}	
		
		  );
	}

		function resultFail(res,results, fail,currentObjID, currentSrcID) {
			console.log("render ID fail:"+ currentObjID+" "+currentSrcID);
			res.render('pin_it',
				  {
			      fail: fail,
		          success: success=false,
		          currentObjID: currentObjID,
				  currentSrcID: currentSrcID,
		          results: results
					}	
			
			  );
		}
