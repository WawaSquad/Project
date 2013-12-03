var connectData = { 
  "hostname": "cis550project.cumzrn1o3hle.us-west-2.rds.amazonaws.com", 
  "user": "wawa", 
  "password": "cis550",
  "port" : "1521",
  "database": "PENNTR" };
var oracle =  require("oracle");
var objID = 0;

function find_objID(res, photo_url, currentBoard) {
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	query="select max(id) as ID from object";
	    	console.log(query);
		  		connection.execute(query, 
		  			 [], 
		  			 function(err, results) {
		  			 if ( err ) {
		  			  	    	console.log(err);
		  			  	    	console.log(query);
		  			  	    	objID = results[0].ID;
		  			  	    	insert_photo(res, photo_url, currentBoard);
		  			  	    } else {
		  			  	    	console.log(results[0].ID);
		  			  	    	console.log(results.returnParam);
		  			  	        objID = results[0].ID;
		  			  	    	insert_photo(res, photo_url, currentBoard);
		  			  	    	connection.close(); // done with the connection
		  	    }
				
	  	}); // end connection.execute
  }
}); // end oracle.connect
}

function insert_photo(res, photo_url, currentBoard) {
		var objID_int = parseInt(objID);
		objID_int = objID_int + 1;
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	query="INSERT INTO Object VALUES ("+objID_int+", 'wawa', 'photo', '"+photo_url+"', 0)";
		  		connection.execute(query, 
		  			 [], 
		  			 function(err, results) {
		  			 if ( err ) {
		  			  	    	console.log(err);
		  			  	    	console.log(query);
		  			  	    	insert_pin(res, currentBoard);
		  			  	    } else {
		  			  	    	insert_pin(res, currentBoard);
		  			  	    	connection.close(); // done with the connection
		  	    }
				
	  	}); // end connection.execute
    }
  }); // end oracle.connect
}

function insert_pin(res, currentBoard) {
	  var srcID = 'wawa';
	  var objID_int = parseInt(objID);
	  objID_int = objID_int + 1;
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	query="INSERT INTO Pin (objectID, sourceID, board, login) VALUES ("
	    		+objID_int+", '"+srcID+"', '"+currentBoard+"', '"+userID+"')";
		  		connection.execute(query, 
		  			 [], 
		  			 function(err, results) {
		  			 if ( err ) {
		  			  	    	console.log(err);
		  			  	    	console.log(query);
		  			  	    	output_result(res,"Failed to add pin to board ", currentBoard);
		  			  	    } else {
		  			  	    	output_result(res,"Successfully added pin to board ", currentBoard);
		  			  	    	connection.close(); // done with the connection
		  	    }
				
	  	}); // end connection.execute
  }
}); // end oracle.connect
}

exports.add_new_photo = function(req, res){
	find_objID(res, req.query.url, req.query.currentBoard);
};

function output_result(res,msg,currentBoard){
	res.render('add_new_photo',
			{msg: msg,
		    currentBoard: currentBoard});
}
