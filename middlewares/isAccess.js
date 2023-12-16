function isAdmin(req,res,next){
    if(!req.session.roles.includes("admin")){
        req.session.message={text: "Görünüşe göre bu sayfa için erişim hakıkınız yok. lütfen yetkili bir hesapla giriş yapınız isAdmin", class:"danger"};
        
        return res.redirect("/auth/login?returnUrl=" + req.originalUrl)

    }
    next()
};

function isShipper(req,res,next){
    if(!req.session.roles.includes("shipper")){
        req.session.message={text: "Görünüşe göre bu sayfa için erişim hakıkınız yok. lütfen yetkili bir hesapla giriş yapınız isShipper", class:"danger"};
        
        return res.redirect("/auth/login?returnUrl=" + req.originalUrl)

    }
    next()
};

function isFirm(req,res,next){
    if(!req.session.roles.includes("admin")){
        req.session.message={text: "Görünüşe göre bu sayfa için erişim hakıkınız yok. lütfen yetkili bir hesapla giriş yapınız isFirm", class:"danger"};
        
        return res.redirect("/auth/login?returnUrl=" + req.originalUrl)

    }
    next()
};

module.exports={ isAdmin, isFirm, isShipper};