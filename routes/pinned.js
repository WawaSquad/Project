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
		  			  	    	console.log(query);
		  			  	    	console.log(objID_str);
		  			  	    	console.log(srcID_str);
		  			  	    	output_result(res,"You probably already haved this pinned on this board...failed to pin on ", boardName);
		  			  	    } else {
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
