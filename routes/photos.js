
var connectData = { 
  "hostname": "cis550project.cumzrn1o3hle.us-west-2.rds.amazonaws.com", 
  "port" :"1521",
  "user": "wawa", 
  "password": "cis550", 
  "database": "PENNTR" };
var oracle =  require("oracle");

function query_db(res,boardName, nextPage) {
	
		 oracle.connect(connectData, function(err, connection) {
			    if ( err ) {
			    	console.log(err);
			    } else { 	
			    	// selecting photos' urls
			    	//"SELECT P.url FROM Photo P WHERE P.photoid = '1'"
			    	//"SELECT count(*) From Photo" 
			    	//
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
				  	    	output_photos(res,nextPage,boardName,results);
				  	    }
				
				  	}); // end connection.execute
			    }
			  }); // end oracle.connect
		 
	  
	}

function output_photos(res,nextPage,boardName,results) {
	console.log('Sending the result');
	res.render('photos',
		   {
		    nextPage : nextPage,
		    boardName : boardName,
			//n_photos_p_page : n_photos_p_page,
			//n_pages : n_pages,
			results: results }
	  );
}

exports.photos = function(req, res){
  query_db(res, req.query.boardName, req.query.nextPage );
  console.log(req.query.boardName + ' hi ' + req.query.nextPage  );
};

