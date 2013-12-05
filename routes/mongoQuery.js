var MongoDb = require("mongodb"),
    db = new MongoDb.Db("test", new MongoDb.Server("localhost", 27017, {auto_reconnect: true}, {}),{fsync:false}),
    fs = require("fs");
var GridStore = MongoDb.GridStore;
var assert = require('assert');

module.exports.storemongo = function (objectID,sourceID, imageURL) {
	//var objectID = req.query.objectID;
	//var sourceID = req.query.sourceID;
   // var imageURL = req.query.url;

	
	var imageType = imageURL.charAt(imageURL.length-3) + imageURL.charAt(imageURL.length-2) +imageURL.charAt(imageURL.length-1);
	
	var imageName = objectID + sourceID + imageType;
	
    console.log("URL : " + imageURL);
    console.log("imageType: " + imageType );
    console.log("imageName: " + imageName );
    
	loadBase64Image(imageURL, function (image, prefix) {});
			
		
		saveImageGrid(imageName, image, db);
		
		//loadImageGrid(imageName, db);	
		
	}); // end of loadBase64		 
    
	// render a new page
	//res.render('mongoreq');
			   
};

var loadBase64Image = function (url, callback) {
    // Required 'request' module
    var request = require('request');

    // Make request to our image url
    request({url: url, encoding: null}, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            // So as encoding set to null then request body became Buffer object
            var base64prefix = 'data:' + res.headers['content-type'] + ';base64,'
                , image = body.toString('base64');
            if (typeof callback == 'function') {
                callback(image, base64prefix);
            }
        } else {
            throw new Error('Can not download image');
        }
    });
};

function saveImageGrid(imageName, imageData, db){

	 db.open(function(err, db) {
		//  if(err) throw err;
	    	
		//   	 console.log('Open db to save an image..');	 
	
      // Create a new file
      var gs = new GridStore(db, imageName, "w");
      // Open the file
      gs.open(function(err, gs) {
    	  if(err) throw err;
     	 console.log('Open GridStore to save an image..');
        gs.write(imageData, function(err, gs) {
        	if(err) throw err;
        	 console.log('Writing the image..');
          gs.close(function(err, gs) {
        	  if(err) throw err;
         	 console.log('Closing GS..');
        	  
       	         db.close();
         	console.log('Closing db..');

          }); // end of gs.close
        }); // end of gs.write
      }); // end of gs.open
}); // end of db.open
	
      //db.open(function(err, db) {});
}
