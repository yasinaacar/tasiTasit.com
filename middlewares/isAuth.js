module.exports=function(req,res,next){
    if(req.session.isAuth !=true){
        req.session.message={text:"Önce oturum açmalısınız", class:"warning"};
        return res.redirect("/auth/login?returnUrl="+req.originalUrl);
    }
    next();
}