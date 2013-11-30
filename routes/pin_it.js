var connectData = { 
  "hostname": "cis550project.cumzrn1o3hle.us-west-2.rds.amazonaws.com", 
  "user": "wawa", 
  "password": "cis550", 
  "database": "PENNTR" };
var oracle =  require("oracle");

function query_db(res, currentObjID, currentSrcID) {
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	var query = "SELECT name, login FROM Board WHERE " +
	    	"login = '"+userID+"'";
		  	
	    	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	console.log(results);
		  	    	output_pins(res, results, currentObjID, currentSrcID);
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	}

function output_pins(res, results, currentObjID, currentSrcID) {
	res.render('pin_it',
		   {
		   	currentObjID: currentObjID,
		   	currentSrcID: currentSrcID,
		   	results: results
		   	}
	  );
}

exports.pin_it = function(req, res){
		query_db(res, req.query.currentObjID, req.query.currentSrcID);
};

