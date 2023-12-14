module.exports=function(req,res,next){
    res.locals.fullname=req.session.fullname;
    res.locals.isAuth=req.session.isAuth;
    res.locals.userID=req.session.userID;
    next();
}