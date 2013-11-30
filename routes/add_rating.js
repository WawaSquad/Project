var connectData = { 
  "hostname": "cis550project.cumzrn1o3hle.us-west-2.rds.amazonaws.com", 
  "user": "wawa", 
  "password": "cis550",
  "port" : "1521",
  "database": "PENNTR" };
var oracle =  require("oracle");

function insert_rating(res,photoID_str,sourceID,score_str) {
	  
	var photoID=parseInt(photoID_str);
	  var score=parseInt(score_str);
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	var initquery="SELECT objectId, sourceId FROM Rating WHERE login='"+userID+"' AND +objectId ="+photoID+" AND sourceId = '"+sourceID+"' ";
	    	console.log(initquery);
	    	var query;
	    	connection.execute(initquery, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    	
		  	    } else {
		  	    	if(results.length==0){
		  	    	   query="INSERT INTO  Rating VALUES ('"+userID+"' , "+photoID+", '"+sourceID+"', "+score+")";
		  	    	   console.log(query);
		  		       connection.execute(query, 
		  			  	 [], 
		  			     function(err, results) {
		  			  	    if ( err ) {
		  			  	    	console.log(err);
		  			  	    	output_result(res,"Failed to insert rating for ",photoID,sourceID);
		  			  	    } else {
		  			  	    	output_result(res,"Successfully added rating for ",photoID,sourceID);
		  			  	    	connection.close(); // done with the connection
		  			  	    }
		  			
		  			  	}); 
		  	    	}
		  	    	
		  	    	else{
		  	    		query="UPDATE Rating SET score="+ score+" WHERE login= '"+ userID +"' AND obejctId ="+ photoID +" AND sourceId = '"+sourceID+"' ";
		  		    	
		  			  	connection.execute(query, 
		  			  			   [], 
		  			  			   function(err, results) {
		  			  	    if ( err ) {
		  			  	    	output_result(res,"Failed to update rating for ", photoID, sourceID);
		  			  	    	console.log(err);
		  			  	    } else {
		  			  	    	output_result(res,"Successfully updated rating for Photo ",photoID, sourceID);
		  			  	    	connection.close(); // done with the connection
		  			  	    }
		  			
		  			  	}); 
		  	    	}
		  	    }
		
		  	}); // end connection.execute
	    
	    }
	  }); // end oracle.connect
	}

exports.add_rating = function(req, res){
	insert_rating(res,req.query.currentObjID,req.query.currentSrcID, req.query.score);
};

function output_result(res,msg,photoID,sourceID){
	res.render('add_rating_result',
			{msg: msg,
		    photoID: photoID,
		    sourceID: sourceID});
}
