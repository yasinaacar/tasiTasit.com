const { Op, and } = require("sequelize");
const {Province, CustomerAdvert, ShipperAdvert, Cargo, CargoType, District, Voyage, Vehicle, VehicleType, Route, User, Offer}=require("../models/index-models");
const { sequelize } = require('../startup/db');
const {randomCodeGenerator, transporter, bcrypt}=require("../helpers/index-helpers");
const config= require("config");
const logger = require("../startup/logger");





exports.get_homepage=async(req,res)=>{
    return res.render("user/homepage",{
        title: "Ana Sayfa"
    })
};

// advert operations
exports.get_adverts=async(req,res)=>{
    const message=req.session.message;
    delete req.session.message;
    const advertType=req.params.advertType;//to show advert by user type
    const provinces=await Province.findAll();
    let adverts;

    if(advertType=="customer"){
         adverts=await CustomerAdvert.findAll({where:{isActive: true, isDeleted: false}, include: [{model: Cargo, include:{model:CargoType}},{model: User, attributes:["fullname"]}],order: [['createdAt', 'DESC']]});
    }else{
         adverts=await ShipperAdvert.findAll({where:{isActive: true, isDeleted: false}, include:[{model: Voyage, include:[{model: Vehicle, include:{model: VehicleType}},{model: Route}]},{model: User, attributes:["fullname"]}],order: [['createdAt', 'DESC']]});
    }
    return res.render("user/adverts",{
        title: "İlanlar",
        provinces: provinces,
        advertType: advertType,
        adverts: adverts,
        message: message
    });
};

exports.post_filter_adverts=async (req,res)=>{
    const advertType=req.params.advertType;
    const startPoint=req.body.startPoint;
    const endPoint=req.body.endPoint;
    const startDate = req.body.startDate ;

    let adverts=[];
    if(advertType=="shipper"){
        const routes = await Route.findAll({
            where: sequelize.literal(`(startPoint = '${startPoint}' OR JSON_CONTAINS(visitPoints, '["${startPoint}"]')) AND (endPoint = '${endPoint}' OR JSON_CONTAINS(visitPoints, '["${endPoint}"]'))`)
        });
        let voyages=[];
        console.log("rotalar------------------>", routes)
        for (const route of routes) {
            let voyage=await Voyage.findAll({
                where:{
                    [Op.and]:[
                        {routeId:route.id},
                        {isDeleted: false},    
                        {startDate: {[Op.lte]:startDate}},
                        {endDate: {[Op.gte]:startDate}},
                    ]
                }
            });
            if(voyage.length>0){
                voyages.push(voyage[0]);
            }
            
        }
        for (const voyage of voyages) {
            const advert=await ShipperAdvert.findAll({where:{voyageId: voyage.id}, include:[{model: Voyage, include:[{model: Vehicle, include:{model: VehicleType}},{model: Route}]},{model: User, attributes:["fullname"]}],order: [['createdAt', 'DESC']]});
            if(advert.length>0){
                adverts.push(advert[0]);
            }
        }
    }
    else if(advertType=="customer"){
        adverts = await CustomerAdvert.findAll({
            where: {
                [Op.and]: [
                    { startPoint: startPoint },
                    { endPoint: endPoint },
                    { startDate: { [Op.lte]: startDate } },
                    { endDate: { [Op.gte]: startDate } },
                    { isActive: true },
                    { isDeleted: false }
                ]
            }, include: [{model: Cargo, include:{model:CargoType}},{model: User, attributes:["fullname"]}],order: [['createdAt', 'DESC']]
        });
    };
    const provinces=await Province.findAll();
    return res.render("user/filtered-adverts",{
        title: "İlanlar",
        provinces: provinces,
        advertType: advertType,
        adverts: adverts,
        startPoint: startPoint,
        endPoint: endPoint,
        startDate: startDate
    });

};

// offer operations
exports.get_create_offer=async (req,res)=>{
    const message=req.session.message;
    delete req.session.message;
    const advertCode=req.params.advertCode;
    const advertType=req.params.advertType;
    const userId=req.session.userID;
    let advert;
    let myAdverts;
    if(advertType=="customer"){
        advert=await CustomerAdvert.findOne({
            where:{
                advertCode: advertCode, isActive: true, isDeleted: false
            }, include: [{model: Cargo, include:{model:CargoType}},{model: User, attributes:["fullname"]}]
        });
        if(advert.userId==userId){
            req.session.message={text:"Kendi ilanınıza teklif veremezsiniz", class:"warning"};
            return res.redirect("/adverts/"+advertType);
        }
        myAdverts=await ShipperAdvert.findAll({
            where:{
                userId: userId, isActive: true, isDeleted: false
            }, include:[{model: Voyage, include:[{model: Vehicle, include:{model: VehicleType}},{model: Route}]}]
        });
        
    }
    else if(advertType=="shipper"){
        advert=await ShipperAdvert.findOne({
            where:{
                advertCode:advertCode, isActive: true, isDeleted: false
            }, include:[{model: Voyage, include:[{model: Vehicle, include:{model: VehicleType}},{model: Route}]},{model: User, attributes:["fullname"]}]
        });
        if(advert.userId==userId){
            req.session.message={text:"Kendi ilanınıza teklif veremezsiniz", class:"warning"};
            return res.redirect("/adverts/"+advertType);
        }
        myAdverts=await CustomerAdvert.findAll({
            where:{
                userId: userId, isActive: true, isDeleted: false
            }
        }); 
    }
    if(!advert){
        req.session.message={text:"Teklif gönderilmek istenen ilan bulunamadı. İlan kaldırılmış ya da değiştirilmiş olabilir", class:"warning"};
        return res.redirect(`/adverts/${advertType}`);
    }
    if(myAdverts<=0){
        req.session.message={text:"Teklif göndermek için en az 1 tane karşı ilana sahip olmanız gerekmektedir.", class:"warning"};
        if(advertType=="customer"){
            return res.redirect(`/shipper/shipper-advert/create/route`)
        }
        else if(advertType=="shipper"){
            return res.redirect("/customer/customer-advert/create/cargo")
        }
    }
    const provinces=await Province.findAll();
    return res.render("user/offer-pages/create-offer",{
        title: "Teklif Gönder",
        advert: advert,
        provinces: provinces,
        myAdverts: myAdverts,
        advertType: advertType,
        message: message
    })

};

exports.post_create_offer= async (req,res)=>{
    const offerToThisAdvert=req.body.offerToThisAdvert;
    const myAdvert=req.body.myAdvert;
    const estimatedDeadline=req.body.estimatedDeadline;
    const estimatedPrice=req.body.estimatedPrice=="" ? 0 : req.body.estimatedPrice;
    const shareContactInfo=req.body.shareContactInfo=="on" ? true: false;
    const advertType=req.params.advertType;
    const advertCode=req.params.advertCode;
    const userId=req.session.userID;

    try {
        if(!shareContactInfo){
            req.session.message={text: `Teklif verebilmek için <b>"İletişim Bilgilerimin teklif sahibiyle paylaşılmasını onaylıyorum"</b> şartını kabul etmeniz gerekiyor`, class:"warning"};
            throw new Error();

        }
        else if(myAdvert=="-1"){
            req.session.message={text: `Teklif verebilmek için <b>"ilanlarınız arasından bir ilan seçmelisiniz"</b>`, class:"warning"};
            throw new Error();
        }
        else{
            let customerAdvert;
            let shipperAdvert;
            let recivedBy;
            if(advertType=="customer"){
                customerAdvert=await CustomerAdvert.findOne({
                    where:{
                        id: offerToThisAdvert,
                        advertCode: advertCode,
                        isActive: true,
                        isDeleted: false,
                    }, attributes:["id", "userId"], raw: true
                });
                if(!customerAdvert){
                    throw new Error(`Id numarası ${offerToThisAdvert} ve İlan kodu ${advertCode} olan herhangi bir ilan bulunamadı`);
                };
                
                shipperAdvert=await ShipperAdvert.findOne({
                    where:{
                        id: myAdvert,
                        userId: userId,
                        isActive: true,
                        isDeleted: false
                    }, attributes:["id"]
                });

                if(!shipperAdvert){
                    throw new Error(`Id numarası ${myAdvert} ilan ve kullanıcı id'si ${userId} olan herhangi bir ilan bulunamadı`);
                };
                recivedBy=customerAdvert.userId;
            }
            else if(advertType=="shipper"){
                shipperAdvert=await ShipperAdvert.findOne({
                    where:{
                        id: offerToThisAdvert,
                        advertCode: advertCode,
                        isActive: true,
                        isDeleted: false,
                    }, attributes:["id", "userId"], raw: true
                });
                if(!shipperAdvert){
                    throw new Error(`Id numarası ${offerToThisAdvert} ve İlan kodu ${advertCode} olan herhangi bir ilan bulunamadı`);
                };
                
                customerAdvert=await CustomerAdvert.findOne({
                    where:{
                        id: myAdvert,
                        userId: userId,
                        isActive: true,
                        isDeleted: false
                    }, attributes:["id"]
                });

                if(!customerAdvert){
                    throw new Error(`Id numarası ${myAdvert} ilan ve kullanıcı id'si ${userId} olan herhangi bir ilan bulunamadı`);
                };
                recivedBy=shipperAdvert.userId;
            }else{
                throw new Error("Advert Type not found")
            }

            let offer=await Offer.create({
                offeredBy: userId,
                recivedBy: recivedBy,
                estimatedDeadline: estimatedDeadline,
                estimatedPrice: estimatedPrice,
                customerAdvertId: customerAdvert.id,
                shipperAdvertId: shipperAdvert.id
            });
            const generatedCode=await randomCodeGenerator("OFR", offer);
            offer.offerCode= generatedCode;
            await offer.save();
            const user=await User.findOne({where:{id: recivedBy},attributes:["email","fullname"]});
            const sendedMail=await transporter.sendMail({
                from: config.get("email.from"),
                to: user.email,
                subject: "Bir Teklif Aldın || tasitasit.com",
                html:`
                    <h1>Merhaba, ${user.fullname}</h1>
                    <p>Taşı Taşıt ile bir ilanına teklif aldın. Teklifi incelemek için <a href="http://127.0.0.1:3000/offers?offerType=recived-offers">tıkla</a> </p><br>
                `
            });
    
            if(sendedMail){
                logger.info(`Yeni Kayıt yapan kullanıcıya mail gönderildi. DETAY: ${sendedMail.messageId}`)
            }

            return res.redirect("/offers?offerType=my-offers");
        }
        
    } catch (err) {
        console.log(err);
        let message="";
        if(err.name=="SequelizeValidationError"){
            for (const e of err.errors) {
                message += `${e.message} <br>`
            }
            req.session.message={text: message, class:"warning"}
        }     

        return res.redirect(`/${advertType}/offer/create/${advertCode}`);
    }
};

exports.post_delete_offer= async (req,res)=>{
    const offerCode=req.params.offerCode;
    const offerId=req.body.offerId;

    try {
        let offer=await Offer.findOne({where:{[Op.and]:[{offerCode: offerCode}, {id: offerId}]}});
        if(!offer){
            req.session.message={text:"Silmek istediğiniz teklif bulunamadı", class:"warning"};
            // throw new Error(`${offerCode} kodlu ve ${offerId} id'li bir teklif bulunmadı`);
            return res.redirect(`/offers?offerType=my-offers`);

        }
        await offer.destroy();
        req.session.message={text:`<b>${offerCode}</b> kodlu teklif başarıyla silindi`, class:"danger"};
        return res.redirect(`/offers?offerType=my-offers`);

    } catch (err) {
        let message="";
        if(err.name=="SequelizeValidationError"){
            for (const e of err.errors) {
                    message += `${e.message} <br>`;
            }
        }
        else{
            logger.error(err.message);
        }

        req.session.message={text: message, class:"warning"};
        return res.redirect(`/offers?offerType=my-offers`);
    }
};

exports.get_offer_detail=async(req,res)=>{
    const {offerCode, offerId, offerType, myRole}=req.query
    let offer=await Offer.findOne({where:{id: offerId, offerCode: offerCode},include:[{model: CustomerAdvert},{model: ShipperAdvert}]});
    let recivedAdvert;
    let offeredAdvert;
    console.log(req.session.haveOffer)
    if(!offer){
        req.session.message={text:`<b>${offerCode}</b> kodlu teklif bulunamadı`, class:"warning"};
        return res.redirect("/offers?offerType="+offerType);
    };
    if(offerType=="recived-offers"){
        offer.isSeened==false ? offer.isSeened=true : "";
        await offer.save();
        req.session.haveOffer= req.session.haveOffer-1;

    };
    if(offerType=="my-offers"){
        if(myRole=="shipper"){
            offeredAdvert=await ShipperAdvert.findOne({
                where:{
                    id: offer.shipperAdvertId
                }, include:[{model: Voyage, include:[{model: Vehicle, include:{model: VehicleType}},{model: Route}]},{model: User, attributes:["fullname"]}]
            });
            recivedAdvert=await CustomerAdvert.findOne({
                where:{
                    id: offer.customerAdvertId
                }, include: [{model: Cargo, include:{model:CargoType}},{model: User, attributes:["fullname"]}]
            });
        }else if(myRole=="customer"){
            offeredAdvert=await CustomerAdvert.findOne({
                where:{
                    id: offer.customerAdvertId
                }, include: [{model: Cargo, include:{model:CargoType}},{model: User, attributes:["fullname"]}]
            });
            recivedAdvert=await ShipperAdvert.findOne({
                where:{
                    id: offer.shipperAdvertId
                }, include:[{model: Voyage, include:[{model: Vehicle, include:{model: VehicleType}},{model: Route}]},{model: User, attributes:["fullname"]}]
            });
        }
    }if(offerType=="recived-offers"){
        if(myRole=="shipper"){
            recivedAdvert=await ShipperAdvert.findOne({
                where:{
                    id: offer.shipperAdvertId
                }, include:[{model: Voyage, include:[{model: Vehicle, include:{model: VehicleType}},{model: Route}]},{model: User, attributes:["fullname"]}]
            });
            offeredAdvert=await CustomerAdvert.findOne({
                where:{
                    id: offer.customerAdvertId
                }, include: [{model: Cargo, include:{model:CargoType}},{model: User, attributes:["fullname"]}]
            });
        }else if(myRole=="customer"){
            recivedAdvert=await CustomerAdvert.findOne({
                where:{
                    id: offer.customerAdvertId
                }, include: [{model: Cargo, include:{model:CargoType}},{model: User, attributes:["fullname"]}]
            });
            offeredAdvert=await ShipperAdvert.findOne({
                where:{
                    id: offer.shipperAdvertId
                }, include:[{model: Voyage, include:[{model: Vehicle, include:{model: VehicleType}},{model: Route}]},{model: User, attributes:["fullname"]}]
            });
        }
    }
    const provinces=await Province.findAll();
    return res.render("user/offer-pages/offer-detail",{
        title: "Teklif Detayı",
        offer: offer,
        recivedAdvert: recivedAdvert,
        offeredAdvert: offeredAdvert,
        offerType: offerType,
        myRole: myRole,
        provinces: provinces
    });

};

exports.post_approve_offer=async(req,res)=>{
    const offerCode=req.params.offerCode;
    const offerId=req.body.offerId;
    let offer=await Offer.findOne({where:{
        id: offerId, offerCode: offerCode
    }});

    if(!offer){
        req.session.message={text:`<b>${offerCode}</b> kodlu teklif bulunamadı`, class:"warning"};
        return res.redirect("/offers?offerType=recived-offers");
    };

    if(offer.isAccepted!=true){
        offer.isAccepted=true;
        await offer.save();
    };
    req.session.message={text:`<b>${offerCode}</b> kodlu teklif onaylandı `, class:"success"};
    return res.redirect("/offers?offerType=recived-offers");

};

exports.post_reject_offer=async(req,res)=>{
    const offerCode=req.params.offerCode;
    const offerId=req.body.offerId;
    let offer=await Offer.findOne({where:{
        id: offerId, offerCode: offerCode
    }});

    if(!offer){
        req.session.message={text:`<b>${offerCode}</b> kodlu teklif bulunamadı`, class:"warning"};
        return res.redirect("/offers?offerType=recived-offers");
    };

    if(offer.isAccepted!=false){
        offer.isAccepted=false;
        await offer.save();
    };
    req.session.message={text:`<b>${offerCode}</b> kodlu teklif reddedildi `, class:"danger"};
    return res.redirect("/offers?offerType=recived-offers");
};

exports.get_offers=async (req,res)=>{
    const userId=req.session.userID;
    const message= req.session.message;
    delete req.session.message;
    const offerType=req.query.offerType;
    let offers;

    if(offerType=="recived-offers"){
        offers=await Offer.findAll({where:{recivedBy: userId},include:[{model: CustomerAdvert, include:{model: User}},{model: ShipperAdvert, include:{model: User}}],order: [['createdAt', 'DESC']]});
    }else if(offerType=="my-offers"){
        offers=await Offer.findAll({where:{offeredBy: userId},include:[{model: CustomerAdvert, include:{model: User}},{model: ShipperAdvert, include:{model: User}}],order: [['createdAt', 'DESC']]});
    }


    return res.render("user/offer-pages/offers",{
        title: "Teklifler",
        message: message,
        offers: offers,
        offerType: offerType,
        userId: userId
    });
};

//account operations
exports.get_account=async (req,res)=>{
    const message=req.session.message;
    delete req.session.message;
    return res.render("user/account-pages/account",{
        title: "Hesabım",
        message: message
    });
};

exports.get_change_password=async (req,res)=>{
    const message=req.session.message;
    delete req.session.message;
    return res.render("user/account-pages/change-password",{
        title: "Şifre değiştir",
        message: message
    });
};

exports.post_change_password=async (req,res)=>{
    const userId=req.session.userID;
    let user=await User.findByPk(userId);
    if(!user){
        req.session.message={text:"Şifresi değiştirilmek istenen kullanıcı bulunamadı, daha sonra tekrar deneyin.", class:"warning"};
        return res.redirect("/account/change-password");
    }
    try {
        
        const {password, newPassword, newPasswordAgain}=req.body;
    
        const match=await bcrypt.compare(password, user.password);
    
        if(!match){
            req.session.message={text:"Şu anki Şifreniz için girdiğiniz değer hatalı", class:"warning"};
            return res.redirect("/account/change-password");
        };
    
        if(await bcrypt.compare(newPassword, user.password)){
            req.session.message={text:"Yeni Şifre ve Şu anki Şifre aynı olamaz", class:"warning"};
            return res.redirect("/account/change-password");
        };
    
        if(newPassword!=newPasswordAgain){
            req.session.message={text:"Yeni Şifre ve Yeni Şifre (Tekrar) Aynı Olmalıdır", class:"warning"};
            return res.redirect("/account/change-password");
        };
    
        const hashedPassword=await bcrypt.hash(newPassword);
    
        user.password=hashedPassword;
        await user.save();
    
        req.session.message={text:"Şifreniz başarıyla güncellendi. Lütfen yeni şifrenizle giriş yapın", class:"success"};
        await req.session.destroy();
        return res.redirect("/auth/login")
    } catch (err) {
        
    }
};

exports.get_edit_contact_informations=async(req,res)=>{
    const message=req.session.message;
    delete req.session.message;
    const userId=req.session.userID;
    const user=await User.findByPk(userId,{attributes:["id", "fullname", "phone", "email"]});

    try {
        if(!user){
            throw new Error(`${userId} id numarasına sahip kullanıcı bulunamadı. İletişim bilgilerimi düzenlede bu hata alındı`);
        };
        
        return res.render("user/account-pages/edit-contact-informations",{
            title: "İletişim Bilgilerim",
            message: message,
            user: user
        })
        
    } catch (err) {
        
    }
};

exports.post_edit_contact_informations=async (req,res)=>{
    const {fullname, phone}=req.body;
    const userId=req.session.userID;
    try {        
        // if(userId!=userID){
        //     throw new Error("Oturum Açan Kişi ile bilgileri değiştirilmek istenen hesap uyuşmuyor. Oturum Açan Kişinin Id'si:"+userID)
        // };
        let user=await User.findByPk(userId,{attributes:["id", "fullname", "email", "phone"]});
        if(user){
            if(user.fullname!=fullname){
                user.fullname=fullname;
            };

            if(user.phone!=phone){
                user.phone=phone;
            };
            await user.save();
            req.session.message={text:"Kullancı bilgileriniz başarıyla güncellendi", class:"primary"};
            return res.redirect("/account/edit-contact-informations");
        }
    } catch (err) {
        console.log(err);
        let message="";
        if(err.name=="SequelizeValidationError"){
            for (const e of err.errors) {
                    message += `${e.message} <br>`;
            }
        }
        else if(err.name=="SequelizeUniqueConstraintError"){
            message="Telefon numarasına kayıtlı başka bir kullanıcı var"
        }
        else{
            logger.error(err.message);
            return res.render("errors/500",{title: "500"});
        }

        req.session.message={text: message, class:"warning"};
        return res.redirect("/account/edit-contact-informations");
    }
};

exports.post_freeze_account=async (req,res)=>{
    const userId=req.session.userID;
    const password=req.body.password;

    try {
        let user=await User.findByPk(userId);
        if(!user){
            throw new Error(`Hesap dondurmak için kullanıcı bulunamadı. İşlemi geerçekleştirmeye çalışan kullanıcı Id: ${userId}`);
        }
        const match=await bcrypt.compare(password, user.password);

        if(!match){
            req.session.message={text:"Hesabınızı dondurabilmek için şifrenizi doğru bir şekilde girmeniz gerekmektedir", class:"warning"};
            return res.redirect("/account");
        };

        let customerAdverts=await CustomerAdvert.findAll({where:{userId: user.id, isActive: true}});

        if(customerAdverts.length>0){
            for (const customerAdvert of customerAdverts) {
                customerAdvert.isActive=false;
                await customerAdvert.save();
                let offers=await Offer.findAll({where:{customerAdvertId: customerAdvert.id, isActive: true}});
                if(offers.length>0){              
                    for (const offer of offers) {
                        offer.isActive=false;
                        await offer.save();
                    }
                }
            };
        };

        if(req.session.isFirm || req.session.isShipper){
            let shipperAdverts=await ShipperAdvert.findAll({where:{userId: user.id, isActive: true}});

            if(shipperAdverts.length>0){
                for (const shipperAdvert of shipperAdverts) {
                    shipperAdvert.isActive=false;
                    await shipperAdvert.save();
                    let offers=await Offer.findAll({where:{shipperAdvertId: shipperAdvert.id, isActive: true}});
                    if(offers.length>0){
                        for (const offer of offers) {
                            offer.isActive=false;
                            await offer.save();
                        }
                    }
                };
            };
        };

        let lastFreezeDate=user.lastFreezeDate;
        if (lastFreezeDate) {
            let earliestFreezeDate = new Date(lastFreezeDate);
            earliestFreezeDate.setDate(earliestFreezeDate.getDate() + 7);
        
            const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
            const formattedLastFreezeDate = earliestFreezeDate.toLocaleDateString('tr-TR', options);
            
            let currentDate = new Date(); // Şu anın tarihini al
            currentDate.setDate(currentDate.getDate() - 7); // Şu andan 7 gün öncesini hesapla
        
            if (earliestFreezeDate < currentDate) { // Eğer son dondurulma tarihinden 7 gün geçmişse
                req.session.message = {
                    text: `Görünüşe göre hesabınızı en son ${formattedLastFreezeDate} tarihinde dondurmuşsunuz. Tekrar dondurma işlemi gerçekleştirebileceğiniz en erken tarih ${formattedLastFreezeDate}`,
                    class: "warning"
                };
                return res.redirect("/account");
            }
        }
        

        user.isFreezed=true;
        user.lastFreezeDate=new Date();
        await user.save();
        
        const sendedMail=await transporter.sendMail({
            from: config.get("email.from"),
            to: user.email,
            subject: "Hesabınız donduruludu || tasitasit.com",
            html:`
                <h1>Merhaba, ${user.fullname}</h1>
                <p>Aramızdan ayrıldığın için üzgünüz, hesabını dondurma talebini aldık ve hesabını dondurduk. Unutma istediğin zaman uygulmaya giriş yaparak tekrar hesabını aktif edebilirsin.</a> </p><br>
            `
        });

        if(sendedMail){
            logger.info(`Hesabını donduran kullanıcıya mail gönderildi. DETAY: ${sendedMail.messageId}`)
        }



        await req.session.destroy();
        return res.redirect("/auth/login");


    } catch (err) {
        console.log(err)
        logger.error(err)
        req.session.message = {
            text: "Bir hata oluştu, lütfen daha sonra tekrar deneyin.",
            class: "danger"
        };
        return res.redirect("/account");
    }
};

exports.get_privacy_and_policy=async (req,res)=>{
    return res.render("user/privacy-and-policy",{
        title: "Gizlilik ve Politika"
    })
};
