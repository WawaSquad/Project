
var connectData = { 
  "hostname": "cis550project.cumzrn1o3hle.us-west-2.rds.amazonaws.com", 
  "user": "wawa", 
  "password": "cis550",
  "port" : "1521",
  "database": "PENNTR" };
var oracle =  require("oracle");


function query_db_recommendation_method(res) {
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	var subquery1="(SELECT Object.id, object.url FROM Object, Tags "+
	    	"WHERE Object.type='photo' AND Tags.id=Object.id AND Object.source=Tags.source"+
	    	"AND Tags.tag IN (SELECT Tags.tag FROM Pin, FriendShip, Tags "+
	    	"WHERE Pin.login=FriendShip.friendID AND Pin.objectId=Tags.id AND Pin.sourceId= Tags.source "+
	    	"AND FriendShip.login='"+userID+"'))";
	    	
	    	var subquery2="(SELECT Object.id, object.url FROM Object, Tags "+
	    	"WHERE Object.type='photo' AND Tags.id=Object.id AND Object.source=Tags.source"+
	    	"AND Tags.tag IN (SELECT Interests.interest FROM Users, Interests  "+
	    	"WHERE Users.login=Interests.login AND Users.login='"+userID+"'))";
	    	
	    	var subquery3="(SELECT Object.id, object.url FROM Users, Pin, Object  "+
	    	"WHERE Object.type='photo' AND Users.login=PIn.login"+
	    	"AND Pin.objectId=Object.id AND Pin.sourceId=Object.source AND Users.login='"+userID+"')";
	    	
	    	var query="SELECT * FROM (SELECT * FROM ("+subquery1+" UNION "+subquery2+" MINUS "+subquery3+") ORDER BY dbms_random.value) WHERE ROWNUM<=10"
	    	
	    	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close();
		  	    	if(results.length==0)
		  	    		output_recommendations(res,results,"Sorry, we donot have recommendations for you now, please be more active!");
		  	    	else
		  	    		output_recommendations(res,results,"Go through these recommendations and see if you like!");
		  	    	}
		  		
		
		  	}); // end connection.execute
	    } 
	  }); // end oracle.connect
	}



function output_recommendations(res,results,Message){
	res.render('userPage',
			 {results:results
		      Message: Message
			 });
	
}

exports.userPage = function(req, res){
	query_db_recommendation(res);
};




