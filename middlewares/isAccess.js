function isAuth(req,res,next){
    if(!req.session.isAuth){
        req.session.message={text:"Önce oturum açmalısınız", class:"warning"};
        return res.redirect("/auth/login?returnUrl="+req.originalUrl);
    }
    next();
};

function isAdmin(req,res,next){
    if(!req.session.roles.includes("admin")){
        req.session.message={text: "Görünüşe göre bu sayfa için erişim hakıkınız yok. bu sayfaya erişmek için 'admin' olmalısınız.", class:"danger"};
        
        return res.redirect("/auth/login?returnUrl=" + req.originalUrl)

    }
    next()
};

function isShipper(req,res,next){
    if(!req.session.roles.includes("shipper")){
        req.session.message={text: "Görünüşe göre bu sayfa için erişim hakıkınız yok. Bu sayfaya erişmek için 'nakliyeci' olmanız gerekiyor ", class:"danger"};
        
        return res.redirect("/auth/login?returnUrl=" + req.originalUrl)

    }
    next()
};

function isFirm(req,res,next){
    if(!req.session.roles.includes("firm")){
        req.session.message={text: "Görünüşe göre bu sayfa için erişim hakıkınız yok. Bu sayfaya erişmek için 'firma' olmalısınız", class:"danger"};
        
        return res.redirect("/auth/login?returnUrl=" + req.originalUrl)

    }
    next()
};


module.exports={ isAuth ,isAdmin, isFirm, isShipper};