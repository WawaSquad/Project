var connectData = { 
  "hostname": "cis550project.cumzrn1o3hle.us-west-2.rds.amazonaws.com", 
  "port" :"1521",
  "user": "wawa", 
  "password": "cis550", 
  "database": "PENNTR" };
var oracle =  require("oracle");

function query_db_remove(res,nextPage,boardName, del_objectID_str,del_sourceID){
     
	 var del_objectID=parseInt(del_objectID_str);
	 oracle.connect(connectData, function(err, connection) {
		    if ( err ) {
		    	console.log(err);
		    } else { 	
		    	console.log("executing the query....");
			  	connection.execute("delete from Pin where Pin.login ='" + userID + "' and Pin.board = '" + boardName + "' and Pin.objectId ="+del_objectID+ "  and Pin.sourceId='"+del_sourceID+"'", 
			  			   [], 
			  			   function(err, results) {
			  	    if ( err ) {
			  	    	console.log(err);
			  	    	var deleted=false;
			  	    	query_db(res,nextPage,boardName,del_objectID,del_sourceID,deleted);
			  	    } else {
			  	    
			  	    	connection.close(); // done with the connection
			  	    	console.log(results);
			  	    	var deleted=true;
			  	    	query_db(res,nextPage,boardName,del_objectID,del_sourceID,deleted);
			  	    }
			
			  	}); // end connection.execute
		    }
		  }); // end oracle.connect
	 

	
}

function query_db(res, nextPage, boardName, del_objectID,del_sourceID,deleted) {
	
		 oracle.connect(connectData, function(err, connection) {
			    if ( err ) {
			    	console.log(err);
			    } else { 	
			    	console.log("executing the query....");
				  	connection.execute("select O.url, P.objectId, P.sourceId  from Object O, Pin P where O.type='photo' and P.sourceId=O.source and P.login ='" + userID + "' and P.board = '" + boardName + "' and P.objectId = O.id", 
				  			   [], 
				  			   function(err, results) {
				  	    if ( err ) {
				  	    	console.log(err);
				  	    	
				  	    } else {
				  	    
				  	    	connection.close(); // done with the connection
				  	    	console.log('Successfully executed the query for the userID = ' + userID +' and BoardName =' + boardName);
				  	    	console.log(results.length);
				  	    	
				  	    	console.log(results);
				  	    	output_photos(res,nextPage,boardName,results, del_objectID,del_sourceID,deleted);
				  	    }
				
				  	}); // end connection.execute
			    }
			  }); // end oracle.connect
		 
	  
	}

function output_photos(res,nextPage,boardName,results, del_objectID,del_sourceID,deleted) {
	console.log('Sending the result');
	res.render('photos',
		   {
		    nextPage : nextPage,
		    boardName : boardName,
		    del_objectID : del_objectID,
		    del_sourceID: del_sourceID,
		    deleted: deleted,
			results: results }
	  );
}

exports.remove_photos = function(req, res){
  query_db_remove(res,  req.query.curr_page, req.query.cur_board,req.query.currentObjID, req.query.currentSrcID );
  
};

