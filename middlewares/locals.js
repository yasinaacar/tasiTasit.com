module.exports=function(req,res,next){
    res.locals.fullname=req.session.fullname;
    res.locals.isAuth=req.session.isAuth;
    res.locals.userID=req.session.userID;
    res.locals.isAdmin=req.session.isAdmin
    res.locals.isShipper=req.session.isShipper;
    res.locals.isFirm=req.session.isFirm;
    next();
}