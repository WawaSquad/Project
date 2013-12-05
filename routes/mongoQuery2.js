var MongoDb = require("mongodb"),
    db = new MongoDb.Db("test", new MongoDb.Server("localhost", 27017, {auto_reconnect: true}, {}),{fsync:false}),
    fs = require("fs");
var GridStore = MongoDb.GridStore;
var assert = require('assert');

exports.searchmongo = function (req,res) {
	var imageName = req.query.imageName;
	var imageType = imageName.charAt(imageName.length-3) + imageName.charAt(imageName.length-2) +imageName.charAt(imageName.length-1);
	
    console.log("Loding .. imageName: " + imageName + '.' + imageType );
    		
	//var imageURI = loadImageGrid(imageName, imageType, db);	
	
	
	// Parsing objectID, sourceID
	// render a new page
	res.render('mongores', {	    
		imageName: imageName }
			
	);
			   
};

function loadImageGrid (imageName,imageType, db){
	
var ret = {};

db.open(function(err, db) {
	if(err) throw err;
	console.log('Opening db to retreive an image');
		 // Define the file we wish to read
	    var gs2 = new GridStore(db, imageName, "r");
	    // Open the file		            
	    gs2.open(function(err, gs2) {
	    	if(err) throw err;
        	 console.log('Opening GS..');
	      // Set the pointer of the read head to the start of the gridstored file
	      gs2.seek(0, function() {
	    	  if(err) throw err;
	        	 console.log('Pointing the head of the image to read..');
	        // Read the entire file
	    	 gs2.read(function(err, imageData) {		               
	    		 if(err) throw err;
	        	 console.log('Reading the image..');
	        	 gs2.close(function(err, gs2) {
	        		 if(err) throw err;
		        	 console.log('Done reading. Closing GS..');
	          
	          			ret = imageData;
	          			db.close();
	          			console.log('Closing the db..');
	          			
	          			console.log('writing the image..');
	          			
	          			res.writeHead('200', {'Content-Type': 'image/' + imageType });	          		    
	          		    res.write(new Buffer(imageData).toString(),'base64');
	          		    req.params.imageName;
	          			
	          }); // end of gs2.close
	        }); // end of gs2. read
	      }); // end of gs2.seek
	    });  // end of gs2.open 
}); // end of db.open

return ret;
	
}