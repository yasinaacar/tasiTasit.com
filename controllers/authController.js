//models
const {  Role, User, Offer, Driver }=require("../models/index-models");

//helper
const {bcrypt, transporter, randomCodeGenerator, slugfield,}=require("../helpers/index-helpers");

const { Op } = require("sequelize");

//middlewares
const {isAuth}=require("../middlewares/isAccess");

const jwt=require("jsonwebtoken");
const config= require("config");

const logger = require("../startup/logger");

//register
exports.get_register=async(req,res)=>{
    const userType=req.params.userType;
    const message=req.session.message;
    delete req.session.message;
    return res.render("auth/register",{
        title:"Üye Ol",
        userType: userType,
        message: message
    });
};
exports.post_register=async(req,res)=>{
    const userType=req.params.userType;
    const fullname=req.body.fullname;
    const email=req.body.email;
    const password=req.body.password;
    const phone=req.body.phone;
    const termsAndConditions=req.body.termsAndConditions == "on" ? true: false;
    try {
        //getRoleByName function is taking user type ande searching in roles and return that role
        function getRoleByName(userType) {
            return roles.find(rol => rol.roleName === userType);
        };
        if(!termsAndConditions){
            req.session.message={text:"Şartlar ve Koşulları onaylamanız gerekir", class:"warning"};
            return res.redirect("/auth/register/"+userType);
        }
        const hashedPassword=await bcrypt.hash(password);
        const user=await User.create({
            fullname: fullname,
            email: email,
            password: hashedPassword,
            phone: phone,
            termsAndConditions: termsAndConditions,
            isActive: false
        });
        user.userCode=await randomCodeGenerator("USR",user);
        user.token=jwt.sign(user.id, config.get("jwt.privateKey"));
        user.tokenExpiration= 1000*60 + Date.now();
        await user.save();
        const roles=await Role.findAll({raw:true});
        const customer=getRoleByName("customer");
        await user.addRole(customer.id);//set customer role for user (default every user must be customer)  
        const selectedRole=getRoleByName(userType);
        await user.addRole(selectedRole.id);//set selected role for user
        if(userType=="shipper"){
            let driver=await Driver.create({
                fullname: user.fullname,
                phone: user.phone,
                email: user.email,
                url:slugfield(user.fullname),
                userId: user.id
            });
            driver.driverCode=await randomCodeGenerator("DRV", driver);
            await driver.save();
        }
        const sendedMail=await transporter.sendMail({
            from: config.get("email.from"),
            to: user.email,
            subject: "Taşı Taşıt'a Hoş geldin",
            html:`
                <h1>Hoş geldin</h1>
                <p>tasitasit.com olarak seni aramızda görmekten mutluluk duyuyoruz. Aşağıdaki linke 30 dakika içerisinde tıklayarak hesabını aktif edebilirsin ve sonrasında uygulmamaıza giriş yapabilirsin </p><br>
                <a href="http://127.0.0.1:3000/auth/activate-user/${user.token}">Hesabı aktif etmek için tıkla</a>
                <p>Bu hesap sana ait değilse aşağıdaki  <a href="#">linke</a> tıklayarak bunu bize bildirebilirsin</p>
            `
        });

        if(sendedMail){
            logger.info(`Yeni Kayıt yapan kullanıcıya mail gönderildi. DETAY: ${sendedMail.messageId}`)
        }

        req.session.message={text:`<b>"${user.email}"</b> adresine bir onaylama e postası gönderdik. E-Mailini onayladıktan sonra hesabına giriş yapabilirsin`, class: "warning"}
        return res.redirect("/auth/login");
    } catch (err) {
        let message= "";
        if(err.name=="SequelizeUniqueConstraintError"){
            for (const e of err.errors) {
                message += `${e.message} <br>`;

            }
            req.session.message={text:message, class:"danger"};

        }
        else if(err.name=="SequelizeValidationError"){
            for (const e of err.errors) {
                message += `${e.message} <br>`;
            }
            req.session.message={text:message, class:"warning"};
        }
        else{
            logger.error(err.message);
            return res.render("errors/500",{title: "500"});
        }

        return res.redirect("/auth/register/"+userType);
    }
};

//login
exports.get_login=async(req,res)=>{
    const message=req.session.message;
    delete req.session.message;
    return res.render("auth/login",{
        title:"Giriş Yap",
        message: message
    });
};
exports.post_login=async(req,res)=>{
    if(isAuth){
        req.session.isAuth=false;

    }
    const email=req.body.email;
    const password=req.body.password;
    const url=req.query.returnUrl ? req.query.returnUrl : "/";

    const user=await User.findOne({where:{email: email},include:{model:Role, attributes:["roleName"]}});
    if(!user){
        req.session.message={text:"Bu e-posta adresine kayıtlı kullanıcı yok.", class:"warning"};
        return res.redirect("/auth/login");
    }
    //if user account is not active delete user
    if(user.isActive==false && user.tokenExpiration<Date.now()){
        const sendedMail=await transporter.sendMail({
            from: config.get("email.from"),
            to: user.email,
            subject: "Hesabın Silindi || tasitasit.com",
            html:`
                <h1>Merhaba</h1>
                <h5>Sevgili ${user.fullname}</h5>
                <p>tasitasit.com sitesindeki hesabınız mail onayı süresini geçridiğiniz için askıya silinmiştir. Dilerseniz aşağıdaki linki kullanarak yeni bir hesap oluşturabilirsiniz</p><br>
                <a href="http://127.0.0.1:3000/auth/register/customer">Yeni Hesap Oluştur</a>
            `
        });

        if(sendedMail){
            logger.info(`Hesabı silinen kullanıcıya mail gönderildi. DETAY: ${sendedMail.messageId}`)
        }

        await user.destroy();

        req.session.message={text:"E-Posta onay süresini doldurduğunuz için hesabınız askıya alındı. Tekrar üye olabilir ve hesabınızı doğruladıktan sonra uygulamayı kullanmaya başlayabilirsiniz.", class:"danger"};
        return res.redirect("/auth/login");
    }

    if(user.isActive==false){
        req.session.message={text:`Görünüşe göre hesabınız henüz aktif edilmemiş. Hesabınızı aktif etmek için e-postanıza gelen linki kullanarak hesabınız aktif edebilirsiniz`, message:"warning"};
        return res.redirect("/auth/login");
    }

    if(user.isBlocked==true){
        req.session.message={text:"Görünüşe göre topluluk kurallarını ihlal ettiğiniz için hesabınız askıya alınmış. Maalesef bu hesap artık aktif değil", class:"danger"};
        return res.redirect("/auth/login");      
    }

    if(user.isActive==true){
        const match=await bcrypt.compare(password,user.password);

        if(match){
            user.lastActivity=new Date();
            if(user.isFreezed){
                user.isFreezed=false;
                
            }
            await user.save();
            req.session.isAuth=true;
            req.session.fullname=user.fullname;
            req.session.userID=user.id;
            req.session.roles=user.roles.map(role=>role["roleName"]);
            req.session.isCustomer=true;
            if(req.session.roles.includes("admin")){
                req.session.isAdmin=true;
                req.session.isShipper=true;
                req.session.isFirm=true;
            }
            else if(req.session.roles.includes("firm")){
                req.session.isAdmin=false;
                req.session.isFirm=true;
                req.session.isShipper=true;
            }
            else if(req.session.roles.includes("shipper")){
                req.session.isAdmin=false;
                req.session.isFirm=false;
                req.session.isShipper=true;
            }
            const offers=await Offer.findAll({where:{
                [Op.and]:[
                    {recivedBy: user.id},{isSeened: false}
                ]
            
            }});
            req.session.haveOffer=offers.length;

            return res.redirect(url);
        }
        req.session.message={text:"Parola yanlış", class:"warning"};
        return res.redirect("/auth/login");

    }

};

//activate user / confirm e-mail
exports.get_activate_user=async(req,res)=>{
    const token=req.params.token;
    return res.render("auth/activate-user",{
        title:"Hesabı Aktileştir",
        token: token
    })
    
};
exports.post_activate_user=async(req,res)=>{
    console.log("Aktive et kısmı çalıştı")
    const token=req.params.token;

    const user=await User.findOne({where:{token: token}});

    if(user.isActive==true){
        req.session.message={text:"Hesabınız zaten aktif edilmiş, uygulamaya giriş yapabilirsiniz", class:"warning"};
    }
    //if user account is not active and token expiration is time out delete user
    if(user.isActive==false && user.tokenExpiration<Date.now()){
        const sendedMail=await transporter.sendMail({
            from: config.get("email.from"),
            to: user.email,
            subject: "Hesabın Silindi || tasitasit.com",
            html:`
                <h1>Merhaba</h1>
                <h5>Sevgili ${user.fullname}</h5>
                <p>tasitasit.com sitesindeki hesabınız mail onayı süresini geçridiğiniz için askıya silinmiştir. Dilerseniz aşağıdaki linki kullanarak yeni bir hesap oluşturabilirsiniz</p><br>
                <a href="http://127.0.0.1:3000/auth/register/customer">Yeni Hesap Oluştur</a>
            `
        });

        if(sendedMail){
            logger.info(`Hesabı silinen kullanıcıya mail gönderildi. DETAY: ${sendedMail.messageId}`)
        }

        await user.destroy();

        req.session.message={text:"E-Posta onay süresini doldurduğunuz için hesabınız askıya alındı. Tekrar üye olabilir ve hesabınızı doğruladıktan sonra uygulamayı kullanmaya başlayabilirsiniz.", class:"danger"};
    }
    if(user.isActive==false && user.tokenExpiration>=Date.now()){
        user.isActive=true;
        user.token=null;
        user.tokenExpiration=null;
        await user.save();
        
        req.session.message={text:"Hesabınız başarıyla aktifleştirildi, hesabınıza giriş yapabilirsiniz", class:"success"};
    }
    return res.redirect("/auth/login");
};

//logout 
exports.post_logout=async(req,res)=>{
    await req.session.destroy();
    return res.redirect("/auth/login")
};

//forgot my password
exports.get_reset_password=async(req,res)=>{
    const message=req.session.message;
    delete req.session.message;

    return res.render("auth/reset-password",{
        title:"Şifremi Unuttum",
        message: message
    })
};
exports.post_reset_password=async(req,res)=>{
    const email=req.body.email;

    const user=await User.findOne({where:{email:email}});

    if(!user){
        req.session.message={text:"Bu mail adresine kayıtlı bir hesap yok", class:"warning"};
        return res.redirect("/auth/reset-password");
    }

    const token= jwt.sign(user.id, config.get("jwt.privateKey"));
    user.token=token;
    user.tokenExpiration=1000*60*30 + Date.now();
    await user.save();

    const sendedMail=await transporter.sendMail({
        from: config.get("email.from"),
        to: user.email,
        subject: "Şifremi Unuttum || tasitasit.com",
        html:`
            <h5>Merhaba, ${user.fullname}</h5>
            <p>Şifreni sıfırlama talebini aldık, aşağıdaki linki kullanarak 30 dakika içinde yeni şifreni belirleyebilirsin</p><br>
            <a href="http://127.0.0.1:3000/auth/new-password/${user.token}">Şifremi Yenile</a>
        `
    });

    if(sendedMail){
        logger.info(`Yeni Kayıt yapan kullanıcıya mail gönderildi. DETAY: ${sendedMail.messageId}`)
    }

    req.session.message={text:`${user.email} adresli e-postana kurtarma maili gönderdik. Maildeki bağlantı aracılığıyla yeni şifreni belirleyebilirsin`, class:"warning"};
    return res.redirect("/auth/reset-password");
};
exports.get_new_password=async(req,res)=>{
    const message=req.session.message;
    delete req.session.message;

    return res.render("auth/new-password",{
        title:"Şifremi Yenile",
        message: message
    })
};
exports.post_new_password=async(req,res)=>{
    try {
        const token=req.params.token;
        const user=await User.findOne({where:{token:token}});

        if(!user){
            req.session.message={text:"Bağlantı hatalı lütfen tekrar deneyin", class:"warning"};
            return res.redirect("/auth/reset-password");
        }
        else if(user.tokenExpiration<Date.now()){
            user.token=null;
            user.tokenExpiration=null;
            await user.save();
            req.session.message={text:"Gönderilen linkin süresi dolmuş, lütfen tekrar deneyin", class:"danger"};
            return res.redirect("/auth/reset-password");
        }
        
        const password=req.body.password;
        const hashedPassword=await bcrypt.hash(password);
        user.password=hashedPassword;
        user.token=null;
        user.tokenExpiration=null;
        user.lastActivity=new Date();
        user.updatedAt=new Date();
        await user.save();

        req.session.message={text:"Şifreni sıfırladık, yeni şifrenle giriş yapabilirsin.", class:"success"};
        return res.redirect("/auth/login");

    } catch (err) {
        console.log(err)
    }
};