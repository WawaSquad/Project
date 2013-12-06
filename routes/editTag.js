


exports.tag = function(req, res){
	//global.userID=req.body.userID;
	//show_user_info(res,userID);
	var objID=parseInt(req.query.objID);
	console.log("objID in /tag "+objID);
	console.log("srcID in /tag "+req.query.srcID);
	console.log("board in /tag "+req.query.boardName);
	//console.log("srcID in /tag "+srcID);
	show_object_info(res,objID,req.query.srcID,req.query.boardName,false);

};

exports.editInfo = function(req, res){
	//global.userID=req.body.userID;
	var objID=parseInt(req.query.objID);
	console.log("srcID in /editInfo "+req.query.srcID);
	console.log("objID in /editInfo "+req.query.objID);
	console.log("board in /editInfo "+req.query.boardName);
	console.log("tag entered "+req.query.tag);
	editInformation(res, objID, req.query.srcID, req.query.boardName, req.query.tag);

};

//require('./userPage');
//var userPage = require(userPage);

var connectData = { 
  "hostname": "cis550project.cumzrn1o3hle.us-west-2.rds.amazonaws.com", 
  "user": "wawa", 
  "password": "cis550",
  "port" : "1521",
  "database": "PENNTR" };
var oracle =  require("oracle");

function show_object_info(res,objID,srcID,boardName,fail) {
	//var intPageNum;
	 // var objID=parseInt(objID_str);
	  console.log("objID in show_object_info "+objID);
	  console.log("srcID in show_object_info "+srcID);
	  console.log("boardName in show_object_info "+boardName);
	  
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	var query="SELECT tag  FROM Tags WHERE Tags.source = '" + srcID + 
	  			"' and Tags.id="+objID;
	    	
		  	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	if (fail == false)
		  	    		{
		  	    	renderEditpage(res,results,objID,srcID,boardName);
		  	    		}	
		  	    	else
		  	    	{
		  	    	 renderFail(res,results,objID,srcID,boardName);
		  	    	}
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	}

function editInformation(res,objID,srcID,boardName,tag) {
	//var intPageNum;
	 
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	var query="SELECT Tag  FROM Tags WHERE Tags.tag = '" +  tag + 
	  			"' AND Tags.source = '" + srcID + "' and Tags.id="+objID;
	    	
		  	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	if (results[0] == null )
		  	    		{
		  	    		insertData(res,objID,srcID,boardName,tag);
		  	    		}
		  	    	else
		  	    		{
		  	    		console.log("Tag already exists")
		  	    		fail = true;
		  	    		show_object_info(res,objID,srcID,boardName,fail);
		  	    		}
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	}

function renderEditpage(res, results,objID,srcID,boardName) {
	console.log("objID in renderEditpage "+objID);
	console.log("srcID in renderEditpage "+srcID);
	console.log("boardName in renderEditpage "+boardName);
	  
	res.render('editTag',
		   {
			fail: fail = false,
			results: results,
			objectID: objID,
			sourceID: srcID,
			currentboardName: boardName}
	  );
}

function renderFail(res,results,objID,srcID,boardName) {
	console.log("objID in renderFail "+objID);
	console.log("srcID in renderFail "+srcID);
	console.log("boardName in renderFail "+boardName);
	
	res.render('editTag',
		   {
			results: results,
			fail: fail = true,
			objectID:objID,
			sourceID: srcID,
			currentboardName: boardName}
	  );
}

function insertData(res,objID,srcID,boardName,tag) {
	//var intPageNum;
	console.log(userID, tag);
	  oracle.connect(connectData, function(err, connection) {
		  
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	
	    	var query="INSERT INTO Tags (id, source, tag) VALUES ("+ objID +
	  			",  '" + srcID + "', '"+tag+"' ) ";
		  	connection.execute(query, 
		  			   [], 
		  			   function(err,results) {
		  	    if ( err ) {
		  	    	
		  	    	console.log(err);

		  	    } else {
		  	    	console.log("Query Executed")
		  	    	connection.close(); // done with the connection
		  	    	fail = false;
		  	    	console.log("Inserted Correctly");
		  	    	show_object_info(res,objID,srcID,boardName,fail);
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
}


