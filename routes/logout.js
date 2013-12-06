
function removeuserID(res){
	global.userID="";
	renderIndexPage(res,true);
}

function renderIndexPage(res,loggedOut){
	res.render('index',
			{loggedOut:loggedOut});
};

exports.logout = function(req, res){
	removeuserID(res);
}