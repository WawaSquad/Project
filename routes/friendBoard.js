var connectData = { 
  "hostname": "cis550project.cumzrn1o3hle.us-west-2.rds.amazonaws.com", 
  "user": "wawa", 
  "password": "cis550", 
  "database": "PENNTR" };
var oracle =  require("oracle");

function query_db(res) {
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
  	
  			var query = "SELECT b.name, b.login FROM Board b, " +
  			"Friendship f WHERE '" + userID+ "' = f.login AND f.friendID = b.login";
	    	
	    	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	output_boards(res, results);
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	}

function output_boards(res, results) {
	res.render('friendBoard',
		   {results: results }
	  );
}

exports.friendBoard = function(req, res){
	query_db(res);
};

