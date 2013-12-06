
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
	    	var subquery1="(SELECT Object.id, object.url, object.source, listagg(Tags.tag,', ') within group(order by Tags.tag) TAGS, Object.isCached FROM Object, Tags "+
	    	"WHERE Object.type='photo' AND Tags.id=Object.id AND Object.source=Tags.source "+
	    	"AND Tags.tag IN (SELECT Tags.tag FROM Pin, FriendShip, Tags "+
	    	"WHERE Pin.login=FriendShip.friendID AND Pin.objectId=Tags.id AND Pin.sourceId= Tags.source "+
	    	"AND FriendShip.login='"+userID+"') GROUP BY (Object.id, Object.source, Object.url, Object.isCached))";
	    	console.log(subquery1);
	    	
	    	var subquery2="(SELECT Object.id, object.url, object.source, listagg(Tags.tag,', ') within group(order by Tags.tag) TAGS, Object.isCached FROM Object, Tags "+
	    	"WHERE Object.type='photo' AND Tags.id=Object.id AND Object.source=Tags.source "+
	    	"AND Tags.tag IN (SELECT Interests.interest FROM Users, Interests  "+
	    	"WHERE Users.login=Interests.login AND Users.login='"+userID+"') GROUP BY (Object.id, Object.source, Object.url, Object.isCached))";
	    	console.log(subquery2);
	    	
	    	var subquery3="(SELECT Object.id, object.url, object.source, listagg(Tags.tag,', ') within group(order by Tags.tag) TAGS, Object.isCached FROM Object, Tags "+
	    	"WHERE Object.type='photo' AND Tags.id=Object.id AND Object.source=Tags.source "+
	    	"AND Tags.tag IN (SELECT Tags.tag FROM Pin, Tags "+
	    	"WHERE  Pin.objectId=Tags.id AND Pin.sourceId= Tags.source "+
	    	"AND Pin.login='"+userID+"') GROUP BY (Object.id, Object.source, Object.url, Object.isCached))";
	    	console.log(subquery3);
	    	
	    	var subquery4="(SELECT comb.id,comb.url,comb.source, comb.isCached, listagg(Tags.tag,', ') within group(order by Tags.tag) TAGS from (SELECT Object.id, object.url, object.source, Object.isCached FROM Object, (select * from (select "+
	    	"Rating.objectId, Rating.sourceId from Rating where Rating.login='"+userID+"' "+
	    	"order by rating DESC) where rownum<=10) R where Object.type='photo' AND Object.id=R.objectId and Object.source=R.sourceId) comb left outer join Tags on comb.id=Tags.id and comb.source=Tags.source GROUP BY (comb.id, comb.source, comb.url, comb.isCached))";
	    	console.log(subquery4);
	    	
	    	var subquery5="(SELECT comb.id,comb.url,comb.source, comb.isCached, listagg(Tags.tag,', ') within group(order by Tags.tag) TAGS from (SELECT Object.id, object.url, object.source, Object.isCached FROM Object, (select * from (select "+
	    	"Pin.objectId, Pin.sourceId from Pin group by Pin.objectId, Pin.sourceId "+
	    	"order by count(*) DESC) where rownum<=10) P where Object.type='photo' AND Object.id=P.objectId and Object.source=P.sourceId)comb left outer join Tags on Tags.id=comb.id and Tags.source=comb.source GROUP BY (comb.id, comb.source, comb.url, comb.isCached))"
	    	console.log(subquery5);
	    	
	    	var subquery6="(SELECT comb.id,comb.url,comb.source, comb.isCached, listagg(Tags.tag,', ') within group(order by Tags.tag) TAGS from (SELECT Object.id, object.url, object.source, Object.isCached FROM Object, (select * from (select "+
	    	"Rating.objectId, Rating.sourceId from Rating GROUP BY Rating.objectId, Rating.sourceId  "+
	    	"order by avg(rating) DESC) where rownum<=10) R where Object.type='photo' AND Object.id=R.objectId and Object.source=R.sourceId AND Object.type='photo' ) comb left outer join Tags on comb.id=Tags.id and comb.source=Tags.source GROUP BY (comb.id, comb.source, comb.url, comb.isCached))"
	    	console.log(subquery6);
	    	
	    	var subquery7="(SELECT comb.id,comb.url,comb.source, comb.isCached, listagg(Tags.tag,', ') within group(order by Tags.tag) TAGS from (SELECT Object.id, object.url, object.source, Object.isCached FROM Users, Pin, Object  "+
	    	"WHERE Object.type='photo' AND Users.login=Pin.login "+
	    	"AND Pin.objectId=Object.id AND Pin.sourceId=Object.source AND Users.login='"+userID+"' ) comb left outer join Tags on Tags.id=comb.id and Tags.source=comb.source GROUP BY (comb.id, comb.source, comb.url, comb.isCached))";
	    	console.log(subquery7);
	    	
	    	var query="SELECT * FROM (SELECT * FROM ("+subquery1+" UNION "+subquery2+" UNION "+subquery3+" UNION "+subquery4+" UNION "+subquery5+" UNION "+subquery6+" MINUS "+subquery7+") ORDER BY dbms_random.value) WHERE ROWNUM<=5"
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






