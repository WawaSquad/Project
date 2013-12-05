var connectData = { 
  "hostname": "cis550project.cumzrn1o3hle.us-west-2.rds.amazonaws.com", 
  "user": "wawa", 
  "password": "cis550",
  "port" : "1521",
  "database": "PENNTR" };
var oracle =  require("oracle");

function insert_pin(res,objID_str, srcID_str, boardName_str) {
	  var objID=parseInt(objID_str);
	  var srcID=srcID_str;
	  var boardName=boardName_str;
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	query="INSERT INTO Pin (objectID, sourceID, board, login) VALUES ("
	    		+objID+", '"+srcID+"', '"+boardName+"', '"+userID+"')";
		  		connection.execute(query, 
		  			 [], 
		  			 function(err, results) {
		  			 if ( err ) {
		  			  	    	console.log(err);
		  			  	    	console.log("error for:"+query);
		  			  	    	console.log(objID_str);
		  			  	    	console.log(srcID_str);
		  			  	    	output_result(res,"You probably already haved this pinned on this board...failed to pin on ", boardName);
		  			  	    } else {
		  			  	    	check_pinning_time(objID, srcID);
		  			  	    	output_result(res,"Successfully added pin to ", boardName);
		  			  	    	connection.close(); // done with the connection
		  	    }
				
	  	}); // end connection.execute
    }
  }); // end oracle.connect
}

exports.pinned = function(req, res){
	insert_pin(res,req.query.currentObjID,req.query.currentSrcID, req.query.boardName);
};

function output_result(res,msg,boardName){
	res.render('pinned',
			{msg: msg,
		    boardName: boardName});
}

function check_pinning_time(objID, srcID){
	
	oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);f
	    } else {
	    	query="SELECT count(*) NUM from Pin where objectId="+objID+" and sourceId='"+ 
	    		srcID+"' group by objectId, sourceId";
		  		connection.execute(query, 
		  			 [], 
		  			 function(err, results) {
		  			 if ( err ) {
		  			  	    	console.log(err);
		  			  	    	console.log("error executing:"+query);
		  			  	    	console.log(objID);
		  			  	    	console.log(srcID);
		  			  	    } else {
		  			  	    	connection.close(); // done with the connection
		  			  	    	var num= results[0].NUM;
		  			  	    	console.log("number pinned before: "+num);
		  			  	    	if(num>=4){
		  			  	    		indicateCache(objID, srcID)
		  			  	    		
		  			  	    	}
		  	    }
				
	  	}); // end connection.execute
    }
  }); // end oracle.connect
}

function indicateCache(objID, srcID){
	oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	query="UPDATE Object set isCached='T' where id="+objID+" and source='"+ 
	    		srcID+"'";
		  		connection.execute(query, 
		  			 [], 
		  			 function(err, results) {
		  			 if ( err ) {
		  			  	    	console.log(err);
		  			  	    	console.log("error for:"+query);
		  			  	    } else {
		  			  	    	connection.close(); // done with the connection
		  			  	    	query_url(objID, srcID);
		  			  	    	
		  	    }
				
	  	}); // end connection.execute
    }
  }); // end oracle.connect

}

function query_url(objID, srcID){
	oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	query="SELECT url from Object where id="+objID+" and source='"+ 
	    		srcID+"'";
		  		connection.execute(query, 
		  			 [], 
		  			 function(err, results) {
		  			 if ( err ) {
		  			  	    	console.log(err);
		  			  	    	console.log(query);
		  			  	    } else {
		  			  	    	connection.close(); // done with the connection
		  			  	    	var url=results[0].URL;
		  			  	    		//insert into mongo 
		  			  	    	console.log("URL is: "+url);
		  			  	    	
		  			  	    	//store to mongo below
		  		    	
		  	    }
				
	  	}); // end connection.execute
    }
  }); // end oracle.connect

}