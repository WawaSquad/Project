var connectData = { 
  "hostname": "cis550project.cumzrn1o3hle.us-west-2.rds.amazonaws.com", 
  "user": "wawa", 
  "password": "cis550",
  "port" : "1521",
  "database": "PENNTR" };
var oracle =  require("oracle");

function insert_rating(res,photoID_str,score_str) {
	  var photoID=parseInt(photoID_str);
	  var score=parseInt(score_str);
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	
	    	var query="INSERT INTO  Rating VALUES ( '"+photoID+"', '"+userID+"', '"+score+"')";
	    	console.log(query);
		  	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	}

exports.add_rating = function(req, res){
	insert_rating(res,req.query.photoID,req.query.score);
};


