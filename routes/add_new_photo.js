var connectData = { 
  "hostname": "cis550project.cumzrn1o3hle.us-west-2.rds.amazonaws.com", 
  "user": "wawa", 
  "password": "cis550",
  "port" : "1521",
  "database": "PENNTR" };
var oracle =  require("oracle");
//var objID = 0;

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
		  			  	    	output_result(res,"Failed to add pin to board ", currentBoard,"","wawa");
		  			  	    	//objID = results[0].ID;
		  			  	    	//insert_photo(res,objID, photo_url, tag, currentBoard);
		  			  	    } else {
		  			  	    	console.log(results[0].ID);
		  			  	    	//console.log(results.returnParam);
		  			  	    	console.log(currentBoard);
		  			  	        objID = results[0].ID;
		  			  	        console.log("objID from find_objID is:"+objID);
		  			  	    	insert_photo(res, objID,photo_url, currentBoard);
		  			  	    	connection.close(); // done with the connection
		  	    }
				
	  	}); // end connection.execute
  }
}); // end oracle.connect
}

function insert_photo(res, objID, photo_url, currentBoard) {
		//var objID_int = parseInt(objID);
		//objID_int = objID_int + 1;
	  objID=objID+1;
	  console.log("increased objID in insert_photo:"+objID);
	  console.log("photo url is: "+photo_url);
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	query="INSERT INTO Object VALUES ("+objID+", 'wawa', 'photo', '"+photo_url+"', 'F')";
		  		connection.execute(query, 
		  			 [], 
		  			 function(err, results) {
		  			 if ( err ) {
		  			  	    	console.log(err);
		  			  	    	console.log(query);
		  			  	    	//insert_pin(res, currentBoard);
		  			  	    	output_result(res,"Failed to add pin to board ", currentBoard,objID.toString(),"wawa");
		  			  	    } else {
		  			  	    	//insert_pin(res, currentBoard);
		  			  	    	console.log(currentBoard);
		  			  	    	insert_pin(res, objID, currentBoard);
		  			  	    	connection.close(); // done with the connection
		  	    }
				
	  	}); // end connection.execute
    }
  }); // end oracle.connect
}
/*
function insert_tag(res, objID, tag, currentBoard) {
	  var srcID = 'wawa';
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	query="INSERT INTO Tags VALUES ("
	    		+objID+", '"+srcID+"', '"+tag+"')";
		  		connection.execute(query, 
		  			 [], 
		  			 function(err, results) {
		  			 if ( err ) {
		  			  	    	console.log(err);
		  			  	    	console.log(query);
		  			  	        insert_pin(res, currentBoard);
		  			  	    } else {
		  			  	    	console.log(currentBoard);
		  			  	        insert_pin(res, currentBoard);
		  			  	    	connection.close(); // done with the connection
		  	    }
				
	  	}); // end connection.execute
}
}); // end oracle.connect
}
*/

function insert_pin(res, objID, currentBoard) {
	  var srcID = "wawa";
	  //var objID_int = parseInt(objID);
	  //objID_int = objID_int + 1;
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	query="INSERT INTO Pin (objectID, sourceID, board, login) VALUES ("
	    		+objID+", '"+srcID+"', '"+currentBoard+"', '"+userID+"')";
		  		connection.execute(query, 
		  			 [], 
		  			 function(err, results) {
		  			 if ( err ) {
		  			  	    	console.log(err);
		  			  	    	console.log(query);
		  			  	    	output_result(res,"Failed to add pin to board ", currentBoard,objID.toString(),srcID);
		  			  	    } else {
		  			  	    	output_result(res,"Successfully added pin to board ", currentBoard,objID.toString(),srcID);
		  			  	    	connection.close(); // done with the connection
		  	    }
				
	  	}); // end connection.execute
  }
}); // end oracle.connect
}

exports.add_new_photo = function(req, res){
	//find_objID(res, req.query.url, req.query.tag, req.query.currentBoard);
	find_objID(res, req.query.url, req.query.currentBoard);
};

function output_result(res,msg,currentBoard,objID,srcID){
	console.log("output msg:"+msg);
	console.log("output currentBoard: "+currentBoard);
	console.log("output objID "+objID);
	console.log("output srcID "+srcID);
	
	res.render('add_new_photo',
			{msg : msg,
		     currentBoard : currentBoard,
		     objID : objID,
		     srcID : srcID});
}
