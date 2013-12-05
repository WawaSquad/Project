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