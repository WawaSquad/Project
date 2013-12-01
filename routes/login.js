

	
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

							//show_user_info(res1,userID);
							query_db_recommendation(res1,userID); 
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

    


	
	function show_user_info(res,userID,recommendationResults,msg) {
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
			  	    	renderUserpage(res,results,recommendationResults,msg);
			  	    	
			  	    }
			
			  	}); // end connection.execute
		    }
		  }); // end oracle.connect
		}

	
	function renderUserpage(res, results,recommendationResults,msg) {
		res.render('userPage',
			   {
				results: results,
				recommendationResults: recommendationResults,
				msg: msg}
		  );
	}
	
	
	
	function query_db_recommendation(res,userID) {
		  oracle.connect(connectData, function(err, connection) {
		    if ( err ) {
		    	console.log(err);
		    } else {
		    	var subquery1="(SELECT Object.id, object.url, object.source FROM Object, Tags "+
		    	"WHERE Object.type='photo' AND Tags.id=Object.id AND Object.source=Tags.source "+
		    	"AND Tags.tag IN (SELECT Tags.tag FROM Pin, FriendShip, Tags "+
		    	"WHERE Pin.login=FriendShip.friendID AND Pin.objectId=Tags.id AND Pin.sourceId= Tags.source "+
		    	"AND FriendShip.login='"+userID+"'))";
		    	console.log(subquery1);
		    	
		    	var subquery2="(SELECT Object.id, object.url, object.source FROM Object, Tags "+
		    	"WHERE Object.type='photo' AND Tags.id=Object.id AND Object.source=Tags.source "+
		    	"AND Tags.tag IN (SELECT Interests.interest FROM Users, Interests  "+
		    	"WHERE Users.login=Interests.login AND Users.login='"+userID+"'))";
		    	console.log(subquery2);
		    	
		    	var subquery3="(SELECT Object.id, object.url, object.source FROM Object, Tags "+
		    	"WHERE Object.type='photo' AND Tags.id=Object.id AND Object.source=Tags.source "+
		    	"AND Tags.tag IN (SELECT Tags.tag FROM Pin, Tags "+
		    	"WHERE  Pin.objectId=Tags.id AND Pin.sourceId= Tags.source "+
		    	"AND Pin.login='"+userID+"'))";
		    	console.log(subquery3);
		    	
		    	var subquery4="(SELECT Object.id, object.url, object.source FROM Object, (select * from (select "+
		    	"Rating.objectId, Rating.sourceId from Rating where Rating.login='"+userID+"' "+
		    	"order by rating DESC) where rownum<=10) R where Object.id=R.objectId and Object.source=R.sourceId)";
		    	console.log(subquery4);
		    	
		    	var subquery5="(SELECT Object.id, object.url, object.source FROM Users, Pin, Object  "+
		    	"WHERE Object.type='photo' AND Users.login=Pin.login "+
		    	"AND Pin.objectId=Object.id AND Pin.sourceId=Object.source AND Users.login='"+userID+"')";
		    	console.log(subquery5);
		    	
		    	var query="SELECT * FROM (SELECT * FROM ("+subquery1+" UNION "+subquery2+" UNION "+subquery3+" UNION "+subquery4+" MINUS "+subquery5+") ORDER BY dbms_random.value) WHERE ROWNUM<=5"
		    	console.log(query);
		    	connection.execute(query, 
			  			   [], 
			  			   function(err, results) {
			  	    if ( err ) {
			  	    	console.log(err);
			  	    } else {
			  	    	connection.close();
			  	    	if(results.length==0){
			  	    		query_db_recommendation2(res,userID);
			  	    	}
			  	    	else{
			  	    		var msg="Go through these recommendations and see if you like!";
			  	    		show_user_info(res,userID,results,msg);
			  	    	}
			  	    	}
			  		
			
			  	}); // end connection.execute
		    } 
		  }); // end oracle.connect
		}


	function query_db_recommendation2(res,userID) {
		  oracle.connect(connectData, function(err, connection) {
		    if ( err ) {
		    	console.log(err);
		    } else {
		    	var subquery1="(SELECT Object.id, object.url, object.source FROM Object, (select * from (select "+
		    	"Pin.objectId, Pin.sourceId from Pin group by Pin.objectId, Pin.sourceId "+
		    	"order by count(*) DESC) where rownum<=10) P where Object.id=P.objectId and Object.source=P.sourceId)"
		    	console.log(subquery1);
		    	
		    	var subquery2="(SELECT Object.id, object.url, object.source FROM Object, (select * from (select "+
		    	"Rating.objectId, Rating.sourceId from Rating GROUP BY Rating.objectId, Rating.sourceId  "+
		    	"order by avg(rating) DESC) where rownum<=10) R where Object.id=R.objectId and Object.source=R.sourceId AND Object.type='photo')"
		    	console.log(subquery2);
		    	
		    	var subquery3="(SELECT Object.id, object.url, object.source FROM Users, Pin, Object  "+
		    	"WHERE Object.type='photo' AND Users.login=Pin.login "+
		    	"AND Pin.objectId=Object.id AND Pin.sourceId=Object.source AND Users.login='"+userID+"')";
		    	console.log(subquery3);
		    	
		    	var query="SELECT * FROM (SELECT * FROM ("+subquery1+" UNION "+subquery2+" MINUS "+subquery3+") ORDER BY dbms_random.value) WHERE ROWNUM<=5"
		    	console.log(query);
		    	connection.execute(query, 
			  			   [], 
			  			   function(err, results) {
			  	    if ( err ) {
			  	    	console.log(err);
			  	    } else {
			  	    	connection.close();
			  	    	if(results.length==0){
			  	    		var msg="Sorry, we donot have recommendations for you now, please be more active!";
			  	    		show_user_info(res,userID,results,msg);
			  	    	}
			  	    	else{
			  	    		var msg="Go through these recommendations and see if you like!";
			  	    		show_user_info(res,userID,results,msg);
			  	    	}
			  	    	}
			  		
			
			  	}); // end connection.execute
		    } 
		  }); // end oracle.connect
		}


