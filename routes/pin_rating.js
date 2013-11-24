var connectData = { 
  "hostname": "cis550project.cumzrn1o3hle.us-west-2.rds.amazonaws.com", 
  "user": "wawa", 
  "password": "cis550",
  "port" : "1521",
  "database": "PENNTR" };
var oracle =  require("oracle");

function insert_rating(photoID) {
	  var rating=prompt("Please enter your rating","");
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	
	    	var query="INSERT INTO  Rating VALUES ( '"+photoID+"', '"+userID+"', '"+rating+"')";
	    	
		  	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	alert("You have successfully rated this photo!");
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	}

exports.add_rating = function(req, res){
	insert_rating(res,req.query.photoID,parseInt(req.query.rating));
};


function add_pin(photoID,boardName) {
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	
	    	var query="INSERT INTO  Pin VALUES ( '"+photoID+"', '"+boardName+"', '"+userID+"')";
	    	
		  	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	alert("You have successfully pinned this photo!");
		  	    	
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	}

