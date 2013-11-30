
var connectData = { 
  "hostname": "cis550project.cumzrn1o3hle.us-west-2.rds.amazonaws.com", 
  "user": "wawa", 
  "password": "cis550",
  "port" : "1521",
  "database": "PENNTR" };
var oracle =  require("oracle");


function query_db_recommendation(res) {
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	var subquery1="(SELECT Object.id, object.url FROM Object, Tags "+
	    	"WHERE Object.type='photo' AND Tags.id=Object.id AND Object.source=Tags.source "+
	    	"AND Tags.tag IN (SELECT Tags.tag FROM Pin, FriendShip, Tags "+
	    	"WHERE Pin.login=FriendShip.friendID AND Pin.objectId=Tags.id AND Pin.sourceId= Tags.source "+
	    	"AND FriendShip.login='"+userID+"'))";
	    	console.log(subquery1);
	    	
	    	var subquery2="(SELECT Object.id, object.url FROM Object, Tags "+
	    	"WHERE Object.type='photo' AND Tags.id=Object.id AND Object.source=Tags.source "+
	    	"AND Tags.tag IN (SELECT Interests.interest FROM Users, Interests  "+
	    	"WHERE Users.login=Interests.login AND Users.login='"+userID+"'))";
	    	console.log(subquery2);
	    	
	    	var subquery3="(SELECT Object.id, object.url FROM Object, Tags "+
	    	"WHERE Object.type='photo' AND Tags.id=Object.id AND Object.source=Tags.source "+
	    	"AND Tags.tag IN (SELECT Tags.tag FROM Pin, Tags "+
	    	"WHERE  Pin.objectId=Tags.id AND Pin.sourceId= Tags.source "+
	    	"AND Pin.login='"+userID+"'))";
	    	console.log(subquery3);
	    	
	    	var subquery4="(SELECT Object.id, object.url FROM Object, (select * from (select "+
	    	"Rating.objectId, Rating.sourceId from Rating where Rating.login='"+userID+"' "+
	    	"order by rating DESC) where rownum<=10) R where Object.id=R.objectId and Object.source=R.sourceId)";
	    	console.log(subquery4);
	    	
	    	var subquery5="(SELECT Object.id, object.url FROM Users, Pin, Object  "+
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
		  	    		query_db_recommendation2(res);
		  	    	}
		  	    	else{
		  	    		var msg="Go through these recommendations and see if you like!";
		  	    		output_recommendations_existing(res,results,msg);
		  	    	}
		  	    	}
		  		
		
		  	}); // end connection.execute
	    } 
	  }); // end oracle.connect
	}


function query_db_recommendation2(res) {
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	var subquery1="(SELECT Object.id, object.url FROM Object, (select * from (select "+
	    	"Pin.objectId, Pin.sourceId from Pin group by Pin.objectId, Pin.sourceId "+
	    	"order by count(*) DESC) where rownum<=10) P where Object.id=P.objectId and Object.source=P.sourceId)"
	    	console.log(subquery1);
	    	
	    	var subquery2="(SELECT Object.id, object.url FROM Object, (select * from (select "+
	    	"Rating.objectId, Rating.sourceId from Rating "+
	    	"order by rating DESC) where rownum<=10) R where Object.id=R.objectId and Object.source=R.sourceId)"
	    	console.log(subquery2);
	    	
	    	var subquery3="(SELECT Object.id, object.url FROM Users, Pin, Object  "+
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
		  	    		output_recommendations_empty(res,results,msg);
		  	    	}
		  	    	else{
		  	    		var msg="Go through these recommendations and see if you like!";
		  	    		output_recommendations_existing(res,results,msg);
		  	    	}
		  	    	}
		  		
		
		  	}); // end connection.execute
	    } 
	  }); // end oracle.connect
	}


function output_recommendations_empty(res,results,msg){
	res.render('recommendation',
			 {results:results,
		      msg: msg
			 });
	
}

function output_recommendations_existing(res,results,msg){
	res.render('recommendation',
			 {results:results,
		      msg: msg
			 });
	
}

exports.recommendation = function(req, res){
	query_db_recommendation(res);
};






