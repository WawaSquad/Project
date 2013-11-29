


exports.userPage = function(req, res){
	//global.userID=req.body.userID;
  //  res.render('userPage');
	
	show_user_info(res,userID);


};



var connectData = { 
  "hostname": "cis550project.cumzrn1o3hle.us-west-2.rds.amazonaws.com", 
  "user": "wawa", 
  "password": "cis550",
  "port" : "1521",
  "database": "PENNTR" };
var oracle =  require("oracle");

function show_user_info(res,userID) {
	var intPageNum;
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {

	    	var query="SELECT *  FROM Users WHERE Users.login = '" +  userID + 
	  			"' ";
	    	
		  	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	renderUserpage(res,results);
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	}

function renderUserpage(res, results) {
	res.render('userPage',
		   {
			results: results }
	  );
}