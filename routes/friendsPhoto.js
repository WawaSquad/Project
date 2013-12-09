
var connectData = { 
  "hostname": "cis550project.cumzrn1o3hle.us-west-2.rds.amazonaws.com", 
  "port" :"1521",
  "user": "wawa", 
  "password": "cis550", 
  "database": "PENNTR" };
var oracle =  require("oracle");

function query_db(res,boardName, nextPage) {
	
		 oracle.connect(connectData, function(err, connection) {
			    if ( err ) {
			    	console.log(err);
			    } else { 	
			    	// selecting photos' urls
			    	//"SELECT P.url FROM Photo P WHERE P.photoid = '1'"
			    	//"SELECT count(*) From Photo" 
			    	//console.log("executing the query....");
			    	var query="SELECT comb.url,comb.objectId, comb.sourceId, comb.type, comb.isCached, " + "listagg(T.tag,', ') within group(order by T.tag) TAGS from "+"(select O.url, P.objectId, P.sourceid, O.type, O.iscached from Object O, Pin P " + "WHERE  P.sourceId=O.source and P.login in (select FriendID from FriendShip where " +"FriendShip.login = '"+userID+"') and P.board = '"+boardName+"' " +   "and P.objectId = O.id )comb "+  "LEFT OUTER JOIN Tags T ON comb.objectId=T.id AND comb.sourceId= T.source GROUP BY " + "(comb.url,comb.objectid,comb.sourceid,comb.type, comb.iscached)";
				  	connection.execute(query,
				  			   [], 
				  			   function(err, results) {
				  	    if ( err ) {
				  	    	console.log(err);
				  	    } else {
				  	    
				  	    	
				  	    	
				  	    	connection.close(); // done with the connection
				  	    	//console.log('Successfully executed the query for the userID = ' + userID +' and BoardName =' + boardName);
				  	    	//console.log(results.length);
				  	    	
				  	    	//console.log(results);
				  	    	output_photos(res,nextPage,boardName,results);
				  	    }
				
				  	}); // end connection.execute
			    }
			  }); // end oracle.connect
		 
	  
	}

function output_photos(res,nextPage,boardName,results) {
	//console.log('Sending the result');
	res.render('photos',
		   {
		    nextPage : nextPage,
		    boardName : boardName,
		    canPin : false,
			results: results }
	  );
}

exports.friendsPhoto = function(req, res){
  query_db(res, req.query.boardName, req.query.nextPage );  
};

