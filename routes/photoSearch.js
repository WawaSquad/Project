
var connectData = { 
  "hostname": "cis550project.cumzrn1o3hle.us-west-2.rds.amazonaws.com", 
  "user": "wawa", 
  "password": "cis550", 
  "database": "PENNTR" };
var oracle =  require("oracle");

function query_db(res,searchTags,PageNum) {
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	
		  	if(PageNum==null||PageNum=="")
		  		PageNum="1";
		  	var intPageNum=parseInt(PageNum);
	    	var query="SELECT Photo.photoID, Photo.url FROM Photo,Tags WHERE Tags.tag LIKE '%" + searchTags + 
  			"%' AND Photo.photoID=Tags.photoID AND rownum>="+6*(intPageNum-1)+" AND rownum<="+6*intPageNum+" ORDER BY Photo.photoID ";
	    	
		  	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	output_photos(res, searchTags, PageNum,results);
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	}

function output_photos(res,searchTags,PageNum, results) {
	res.render('photoSearch',
		   {searchTags: searchTags,
		    PageNum: PageNum,
		    results: results }
	  );
}

exports.photoSearch = function(req, res){
	query_db(res,req.query.searchTags,req.query.PageNum);
};