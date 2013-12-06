exports.rendereditTag = function(req, res){ 
  var boardName=req.query.boardName;
  var objID=req.query.objID;
  var srcID= req.query.srcID;
  res.render('editTag',
		  {boardName: boardName,
		   objID:objID,
		   srcID: srcID});
};