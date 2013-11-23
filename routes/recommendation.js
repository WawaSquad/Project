
//having userID as global variable
//filter recommending photos based on tags of top three rating photos by that user.
//using random number for ROWNUM of querying results.

var connectData = { 
  "hostname": "cis550project.cumzrn1o3hle.us-west-2.rds.amazonaws.com", 
  "user": "wawa", 
  "password": "cis550", 
  "database": "PENNTR" };
var oracle =  require("oracle");

var getRandomInt=function (min,max)
{return Math.floor(Math.random() * (max - min + 1)) + min;}


function query_db_recommendation() {
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	var query="SELECT Photo.photoID, Photo.url FROM Photo,Tags WHERE Photo.photoID=Tags.photoID AND Tags.tag IN (SELECT " +
	    			"tags.tag FROM Rating, Tags WHERE Rating.photoID=Tags.photoID AND Rating.userID='"+userID+
	    			"' AND ROWNUM<=3 ORDER BY Rating.score DESC)";
		  	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	if(results.length<=5){
		  	    		connection.close();
		  	    		global.Recommendations=results;
		  	    	}
		  	    	else{
		  	    		var start=getRandomInt(0,(results.length-5));
		  	    		query="SELECT Photo.photoID, Photo.url FROM Photo,Tags WHERE Photo.photoID=Tags.photoID AND Tags.tag IN (SELECT " +
		    			"tags.tag FROM Rating, Tags WHERE Rating.photoID=Tags.photoID AND Rating.userID='"+userID+
		    			"' AND ROWNUM<=3 ORDER BY Rating.score DESC) AND ROWNUM>="+start+" AND ROWNUM<="+(start+5);
		  	    		connection.execute(query, 
		 		  			   [], 
		 		  			   function(err, results) {
		 		  	    if ( err ) {
		 		  	    	console.log(err);
		 		  	    } else {
		 		  	    	connection.close();
		 		  	    	global.Recommendations=results;
		 		  	      }
		 		  	    });
		  	    	}
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	}




