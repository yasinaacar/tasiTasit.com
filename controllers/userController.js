const { Op, and } = require("sequelize");
const {Province, CustomerAdvert, ShipperAdvert, Cargo, CargoType, District, Voyage, Vehicle, VehicleType, Route, User, Offer}=require("../models/index-models");
const { sequelize } = require('../startup/db');
const {randomCodeGenerator, transporter}=require("../helpers/index-helpers");
const config= require("config");
const logger = require("../startup/logger");





exports.get_homepage=async(req,res)=>{
    return res.render("user/homepage",{
        title: "Ana Sayfa"
    })
};

exports.get_adverts=async(req,res)=>{
    const message=req.session.message;
    delete req.session.message;
    const advertType=req.params.advertType;//to show advert by user type
    const provinces=await Province.findAll();
    let adverts;

    if(advertType=="customer"){
         adverts=await CustomerAdvert.findAll({where:{isActive: true, isDeleted: false}, include: [{model: Cargo, include:{model:CargoType}},{model: User, attributes:["fullname"]}]});
    }else{
         adverts=await ShipperAdvert.findAll({where:{isActive: true, isDeleted: false}, include:[{model: Voyage, include:[{model: Vehicle, include:{model: VehicleType}},{model: Route}]},{model: User, attributes:["fullname"]}]});
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
            const advert=await ShipperAdvert.findAll({where:{voyageId: voyage.id}, include:[{model: Voyage, include:[{model: Vehicle, include:{model: VehicleType}},{model: Route}]},{model: User, attributes:["fullname"]}]});
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
            }, include: [{model: Cargo, include:{model:CargoType}},{model: User, attributes:["fullname"]}]
        });
    };
    const provinces=await Province.findAll();
    console.log(provinces.some(province=>province.id==startPoint ? province.name : "Yokkkkkkkkkkkkkkk"))
    return res.render("user/filtered-adverts",{
        title: "İlanlar",
        provinces: provinces,
        advertType: advertType,
        adverts: adverts,
        startPoint: startPoint,
        endPoint: endPoint,
        startDate: startDate
        // districts: districts
    });

};

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
}

exports.get_offers=async (req,res)=>{
    const userId=req.session.userID;
    const message= req.session.message;
    delete req.session.message;
    const offerType=req.query.offerType;

    let offers;

    if(offerType=="recived-offers"){
        offers=await Offer.findAll({where:{recivedBy: userId},include:[{model: CustomerAdvert},{model: ShipperAdvert}]});
    }else if(offerType=="my-offers"){
        offers=await Offer.findAll({where:{offeredBy: userId},include:[{model: CustomerAdvert},{model: ShipperAdvert}]});
    }


    return res.render("user/offer-pages/offers",{
        title: "Teklifler",
        message: message,
        offers: offers,
        offerType: offerType,
        userId: userId
    });
};

