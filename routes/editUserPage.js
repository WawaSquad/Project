


exports.editUserPage = function(req, res){
	//global.userID=req.body.userID;
	//show_user_info(res,userID);
	loadPage(res,userID);

};




//var loadUserpage = "./userPage.js";
exports.editInfo = function(req, res){
	//global.userID=req.body.userID;
	editInformation(res,userID,req.body.email,req.body.givenname,req.body.affiliation,req.body.surname);

};

require('./userPage');
//var userPage = require(userPage);

var connectData = { 
  "hostname": "cis550project.cumzrn1o3hle.us-west-2.rds.amazonaws.com", 
  "user": "wawa", 
  "password": "cis550",
  "port" : "1521",
  "database": "PENNTR" };
var oracle =  require("oracle");

function loadPage(res,userID) {
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
		  	    	renderEditpage(res,results);
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	}

function renderEditpage(res, results) {
	res.render('editUserPage',
		   {
			results: results }
	  );
}

function 	editInformation(res,userID,email,givenname,affiliation,surname) {
	var intPageNum;
	console.log(email,givenname,affiliation,surname);
	console.log(userID);
	  oracle.connect(connectData, function(err, connection) {
		  
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	
	    	var query="UPDATE Users SET  email = '"+ email +
	  			"', affiliation = '" + affiliation + "', surname = '"+ surname +
	  	
	  			"', givenname = '" + givenname +"' WHERE   Users.login=  '" +  userID + "' ";
		  	connection.execute(query, 
		  			   [], 
		  			   function(err,results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	//console.log("Query Executed")
		  	    	connection.close(); // done with the connection
		  	    	console.log("loading user page");
		  	  	query_db_recommendation(res,userID); 
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
}

//CODE TO LOAD USERPAGE
function show_user_info(res,userID,recommendationResults,msg) {
	var intPageNum;
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {

	    	var query="SELECT *  FROM Users WHERE Users.login = '" +  userID + 
	  			"'  ";
	    	
		  	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	showInterest(res,results,recommendationResults,msg);
		  	    	
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	}


function showInterest(res,userInfo,recommendationResults,msg) {
	var intPageNum;
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	var query="SELECT Interest  FROM Interests WHERE Interests.login = '" +  userID + 
	  			"' ";
	    	
		  	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	   
		  	    	renderUserpage(res, userInfo,recommendationResults,msg,results);
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	}

function renderUserpage(res, results,recommendationResults,msg,interest) {
	res.render('userPage',
		   {
			results: results,
			recommendationResults: recommendationResults,
			msg: msg,
			interest: interest}
	  );
}



function query_db_recommendation(res,userID) {
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	var subquery1="(SELECT Object.id, object.url, object.source FROM Object, Tags "+
	    	"WHERE Object.type='photo' AND Tags.id=Object.id AND Object.source=Tags.source "+
	    	"AND Tags.tag IN (SELECT Tags.tag FROM Pin, FriendShip, Tags "+
	    	"WHERE Pin.login=FriendShip.friendID AND Pin.objectId=Tags.id AND Pin.sourceId= Tags.source "+
	    	"AND FriendShip.login='"+userID+"'))";
	    	//console.log(subquery1);
	    	
	    	var subquery2="(SELECT Object.id, object.url, object.source FROM Object, Tags "+
	    	"WHERE Object.type='photo' AND Tags.id=Object.id AND Object.source=Tags.source "+
	    	"AND Tags.tag IN (SELECT Interests.interest FROM Users, Interests  "+
	    	"WHERE Users.login=Interests.login AND Users.login='"+userID+"'))";
	    	//console.log(subquery2);
	    	
	    	var subquery3="(SELECT Object.id, object.url, object.source FROM Object, Tags "+
	    	"WHERE Object.type='photo' AND Tags.id=Object.id AND Object.source=Tags.source "+
	    	"AND Tags.tag IN (SELECT Tags.tag FROM Pin, Tags "+
	    	"WHERE  Pin.objectId=Tags.id AND Pin.sourceId= Tags.source "+
	    	"AND Pin.login='"+userID+"'))";
	    	//console.log(subquery3);
	    	
	    	var subquery4="(SELECT Object.id, object.url, object.source FROM Object, (select * from (select "+
	    	"Rating.objectId, Rating.sourceId from Rating where Rating.login='"+userID+"' "+
	    	"order by rating DESC) where rownum<=10) R where Object.id=R.objectId and Object.source=R.sourceId)";
	    	//console.log(subquery4);
	    	
	    	var subquery5="(SELECT Object.id, object.url, object.source FROM Users, Pin, Object  "+
	    	"WHERE Object.type='photo' AND Users.login=Pin.login "+
	    	"AND Pin.objectId=Object.id AND Pin.sourceId=Object.source AND Users.login='"+userID+"')";
	    	//console.log(subquery5);
	    	
	    	var query="SELECT * FROM (SELECT * FROM ("+subquery1+" UNION "+subquery2+" UNION "+subquery3+" UNION "+subquery4+" MINUS "+subquery5+") ORDER BY dbms_random.value) WHERE ROWNUM<=5"
	    	//console.log(query);
	    	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close();
		  	    	if(results.length==0){
		  	    		query_db_recommendation2(res,userID);
		  	    	}
		  	    	else{
		  	    		var msg="Go through these recommendations and see if you like!";
		  	    		show_user_info(res,userID,results,msg);
		  	    	}
		  	    	}
		  		
		
		  	}); // end connection.execute
	    } 
	  }); // end oracle.connect
	}


function query_db_recommendation2(res,userID) {
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	var subquery1="(SELECT Object.id, object.url, object.source FROM Object, (select * from (select "+
	    	"Pin.objectId, Pin.sourceId from Pin group by Pin.objectId, Pin.sourceId "+
	    	"order by count(*) DESC) where rownum<=10) P where Object.id=P.objectId and Object.source=P.sourceId)"
	    	//console.log(subquery1);
	    	
	    	var subquery2="(SELECT Object.id, object.url, object.source FROM Object, (select * from (select "+
	    	"Rating.objectId, Rating.sourceId from Rating GROUP BY Rating.objectId, Rating.sourceId  "+
	    	"order by avg(rating) DESC) where rownum<=10) R where Object.id=R.objectId and Object.source=R.sourceId AND Object.type='photo')"
	    	//console.log(subquery2);
	    	
	    	var subquery3="(SELECT Object.id, object.url, object.source FROM Users, Pin, Object  "+
	    	"WHERE Object.type='photo' AND Users.login=Pin.login "+
	    	"AND Pin.objectId=Object.id AND Pin.sourceId=Object.source AND Users.login='"+userID+"')";
	    	//console.log(subquery3);
	    	
	    	var query="SELECT * FROM (SELECT * FROM ("+subquery1+" UNION "+subquery2+" MINUS "+subquery3+") ORDER BY dbms_random.value) WHERE ROWNUM<=5"
	    	//console.log(query);
	    	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close();
		  	    	if(results.length==0){
		  	    		var msg="Sorry, we donot have recommendations for you now, please be more active!";
		  	    		show_user_info(res,userID,results,msg);
		  	    	}
		  	    	else{
		  	    		var msg="Go through these recommendations and see if you like!";
		  	    		show_user_info(res,userID,results,msg);
		  	    	}
		  	    	}
		  		
		
		  	}); // end connection.execute
	    } 
	  }); // end oracle.connect
	}

