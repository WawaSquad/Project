// Database setup 
var MongoDb = require("mongodb"),
    db = new MongoDb.Db("test", new MongoDb.Server("localhost", 27017, {auto_reconnect: true}, {}),{fsync:false}),
    fs = require("fs");

// Gridstore initiation
var GridStore = MongoDb.GridStore;
var assert = require('assert');

module.exports.storemongo = function (objectID,sourceID, imageURL) {
		
	// set the image type as the last three characters of URL 
	// ex) jpg, png, gif, bmp
	var imageType = imageURL.charAt(imageURL.length-3) + imageURL.charAt(imageURL.length-2) +imageURL.charAt(imageURL.length-1);
	
	// Image name is objectID + sourceID + imageType
	var imageName = objectID + sourceID + imageType;
	
	// DownLoad image from URL + save the image to the MongoDB 
	loadBase64Image(imageURL, function (image, prefix) {	
		//image is returned in base64 format
		saveImageGrid(imageName, image, db);		
	});
			
		   
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
      // Create a new file
      var gs = new GridStore(db, imageName, "w");
      // Open the file
      gs.open(function(err, gs) {
    	  if(err) throw err;
     	 //console.log('Open GridStore to save an image..');
        gs.write(imageData, function(err, gs) {
        	if(err) throw err;
        	// console.log('Writing the image..');
          gs.close(function(err, gs) {
        	  if(err) throw err;
         	 //console.log('Closing GS..');
        	  
       	         db.close();

          }); // end of gs.close
        }); // end of gs.write
      }); // end of gs.open
}); // end of db.open
	
}
