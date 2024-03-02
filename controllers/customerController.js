//models
const { Cargo, CargoType, District, Driver, Province, Role, Route, User, VehicleType, Vehicle, CustomerAdvert }=require("../models/index-models");

//helpers
const {transporter, slugfield, randomCodeGenerator}=require("../helpers/index-helpers");
const { Op } = require("sequelize");
const fs=require("fs");
const logger = require("../startup/logger");




//advert-customer process

exports.get_customer_advert_create=async(req,res)=>{
    const message=req.session.message;
    delete req.session.message;
    const provinces=await Province.findAll();
    return res.render("admin/customer-advert/customer-advert-create",{
        title:"Müşteri İlanı Oluştur",
        message: message,
        provinces: provinces
    });
};
exports.post_customer_advert_create=async(req,res)=>{
    const cargoId=req.params.cargoId;
    
    try {
        
        //default dates
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD formatına çevrildi
        const todayDate = new Date(today);
        const oneMonthLaterDate = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, todayDate.getDate()).toISOString().split('T')[0];
        const title=req.body.title;
        const description=req.body.description;
        const startDate=req.body.startDate ? req.body.startDate: today;
        const endDate=req.body.endDate ? req.body.endDate : oneMonthLaterDate;
        if(endDate<startDate){
            req.session.message={text:"Bitiş tarihi başlangıç tarihini öncesi olmaz", class:"danger"};
            return res.redirect("/customer/customer-advert/create/"+cargoId);

        }
        const startPoint=req.body.startPoint;
        const endPoint=req.body.endPoint;
        const startDistrict=req.body.startDistrict;
        const endDistrict=req.body.endDistrict;
        const isActive=req.body.isActive=="on" ? true : false;
        const userId=req.session.userID;
        
        const advert=await CustomerAdvert.create({
            title: title,
            description: description,
            startDate: startDate,
            endDate: endDate,
            startPoint: startPoint,
            startDistrict: startDistrict,
            endPoint: endPoint,
            endDistrict: endDistrict,
            isActive: isActive,
            userId: userId
        });
        advert.advertCode=await randomCodeGenerator("ADVCST",advert);
        await advert.save();
        const cargo=await Cargo.findByPk(cargoId);
        await advert.setCargo(cargo);
        req.session.message={text:`${advert.advertCode} kodlu ilan yayınlandı`, class:"success"};
        return res.redirect("/customer/customer-adverts")
    } catch (err) {
        console.log(err)
        let message="";
        if(err.name=="SequelizeValidationError"){
            for (const e of err.errors) {
                message += `${e.message} <br>`
            }
        }
        req.session.message={text: message, class:"warning"};
        return res.redirect("/customer/customer-advert/create/"+cargoId);
        

    }
};
exports.get_customer_advert_edit=async(req,res)=>{
    try {
        const message=req.session.message;
        delete req.session.message;
        const advertId=req.params.advertId;
        const userId=req.session.userID;

        const advert=await CustomerAdvert.findOne({where:{[Op.and]:[{id:advertId},{isDeleted: false},{userID: userId}]}});
        const provinces=await Province.findAll();
        const startDistrict=await District.findOne({where:{id:advert.startDistrict},include:{model:Province}});
        const endDistrict=await District.findOne({where:{id:advert.endDistrict},include:{model:Province}});
        return res.render("admin/customer-advert/customer-advert-edit",{
            title:"Kargo Düzenle",
            message: message,
            advert:advert,
            provinces: provinces,
            startDistrict: startDistrict,
            endDistrict: endDistrict
        });
        
    } catch (err) {
        console.log(err)
    }
};
//advert update process not completed
exports.post_customer_advert_edit=async(req,res)=>{
    const advertId=req.body.advertId;
    try {
        
        const today = new Date().toISOString().split('T')[0];
        const todayDate = new Date(today);
        const oneMonthLaterDate = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, todayDate.getDate()).toISOString().split('T')[0];
        const title=req.body.title;
        const description=req.body.description;
        const startDate=req.body.startDate ? req.body.startDate: today;
        const endDate=req.body.endDate ? req.body.endDate : oneMonthLaterDate;
        if(endDate<startDate){
            req.session.message={text:"Bitiş tarihi başlangıç tarihini öncesi olmaz", class:"danger"};
            return res.redirect("/customer/customer-advert/edit/"+advertId);

        }
        const startPoint=req.body.startPoint;
        const startDistrict=req.body.startDistrict;
        const endPoint=req.body.endPoint;
        const endDistrict=req.body.endDistrict;
        const isActive=req.body.isActive=="on" ? true : false;
        const userId=req.session.userID;
        const advert=await CustomerAdvert.findOne({where:{[Op.and]:[{userId: userId},{id: advertId}]},include: {model: Cargo}});
        advert.title=title;
        advert.description=description;
        advert.startDate=startDate;
        advert.endDate=endDate;
        advert.startPoint=startPoint;
        advert.startDistrict=startDistrict;
        advert.endPoint=endPoint;
        advert.endDistrict=endDistrict;
        advert.isActive=isActive;
        await advert.save();
        req.session.message={text:`${advert.advertCode} kodlu ilan yayınlandı`, class:"success"};
        return res.redirect("/customer/customer-adverts")
    } catch (err) {
        console.log(err)
        let message="";
        if(err.name=="SequelizeValidationError"){
            for (const e of err.errors) {
                message += `${e.message} <br>`
            }
        }
        req.session.message={text: message, class:"warning"};
        return res.redirect("/customer/customer-advert/create/"+advertId);


    }
    
    
};
exports.post_customer_advert_delete=async(req,res)=>{
    const advertId=req.body.advertId;
    const advertCode=req.body.advertCode;
    const userId=req.session.userID;
    const advert=await CustomerAdvert.findOne({where:{[Op.and]:[{userId: userId},{id:advertId}]}});
    if(advert){
        advert.isDeleted=true;
        await advert.save();
        await Cargo.update({isDeleted: true},{where:{[Op.and]:[{userId: userId},{id:advert.cargoId}]}}); 
        req.session.message={text:`${advertCode} kodlu ilan silindi`, class:"danger"};
    }else{
        req.session.message={text:`${advertCode} kodlu ilan silinemedi`, class:"danger"};

    }
    return res.redirect("/customer/customer-adverts");

};
exports.get_customer_adverts=async(req,res)=>{
    const message=req.session.message;
    delete req.session.message;
    const userId=req.session.userID;
    const adverts=await CustomerAdvert.findAll({where:{[Op.and]:[{isDeleted: false},{userId: userId}]}, include:{model:Cargo}});
    const districts=await District.findAll({include:{model: Province, attributes:["name"]}, attributes:["id", "name"]});
    return res.render("admin/customer-advert/customer-adverts",{
        title:"İlanlarım",
        message: message,
        adverts: adverts,
        districts: districts
    });
};


//cargo process
exports.get_cargo_create=async(req,res)=>{
    const message=req.session.message;
    delete req.session.message;
    const cargoTypes=await CargoType.findAll({raw: true});
    return res.render("admin/cargo-pages/cargo-create",{
        title:"Kargo Oluştur",
        message: message,
        cargoTypes: cargoTypes
    });
};
exports.post_cargo_create=async(req,res)=>{
    const cargoName=req.body.cargoName;
    const cargoImg=req.file ? req.file.filename:"defaultCargo.jpg";
    const description=req.body.description;
    const weight=req.body.weight ? req.body.weight : 0;
    const verticalHeight=req.body.verticalHeight ? req.body.verticalHeight : 0;
    const horizontalHeight=req.body.horizontalHeight ? req.body.horizontalHeight : 0;
    const cargoType=req.body.cargoType;
    const userId=req.session.userID;

    try {
        const cargo=await Cargo.create({
            cargoName: cargoName,
            cargoImg: cargoImg,
            description: description,
            weight: weight,
            verticalHeight: verticalHeight,
            horizontalHeight: horizontalHeight,
            userId: userId
        });
        await cargo.setCargoType(cargoType);

        cargo.cargoCode=await randomCodeGenerator("CRG", cargo);
        await cargo.save();
        req.session.message={text:`${cargo.cargoCode} kodlu kargo oluşturuldu.`, class:"success"};
        return res.redirect("/customer/customer-advert/create/"+cargo.id);

    } catch (err) {
        console.log(err);
        let message="";
        if(err.name=="SequelizeValidationError"){
            for (const e of err.errors) {
                    message += `${e.message} <br>`
            }
        }
        if(err.name=="SequelizeForeignKeyConstraintError"){
            message=`<b>Kargo Türü</b> boş geçilemez`;
        }
        req.session.message={text:message, class:"warning"};
        return res.redirect("/customer/customer-advert/create/cargo");

    }

};
exports.get_cargo_edit=async(req,res)=>{
    const message=req.session.message;
    delete req.session.message;
    const cargoId=req.params.cargoId;
    const userId=req.session.userID;
    const cargo=await Cargo.findOne({where:{
        [Op.and]:[
            {id:cargoId},{isdeleted:false},{userId: userId}
        ]},
        include:{model:CargoType, attributes:["id", "cargoTypeName"]}
    });
    const advertId=(await cargo.getCustomerAdvert()).id;
    const cargoTypes=await CargoType.findAll({raw: true});
    return res.render("admin/cargo-pages/cargo-edit",{
        title:"Kargo Düzenle",
        message: message,
        cargoTypes: cargoTypes,
        cargo: cargo,
        advertId: advertId
    });
};
exports.post_cargo_edit=async(req,res)=>{
    const advertId=req.body.advertId;
    const cargoId=req.body.cargoId;
    try {
        const cargoName=req.body.cargoName;
        let cargoImg=req.body.cargoImg;
        if(req.file){
            cargoImg=req.file.filename;
    
            if(req.body.cargoImg!="defaultCargo.jpg" || req.body.cargoImg!="cuval.webp"){
                fs.unlink("./public/images/"+req.body.cargoImg,err=>{
                    if(err){
                        logger.error(`Kargo resmi güncellendi ancak eski kargo resmi silinemedi. Silinemeyen resim: ${req.body.cargoImg},${err}`);
                    }
                })
            }
            
        }
        const description=req.body.description;
        const weight=req.body.weight ? req.body.weight : 0;
        const verticalHeight=req.body.verticalHeight ? req.body.verticalHeight : 0;
        const horizontalHeight=req.body.horizontalHeight ? req.body.horizontalHeight : 0;
        const cargoType=req.body.cargoType;
        const cargo=await Cargo.findByPk(cargoId,{include:{model: CargoType, attributes:["id"]}});
        if(cargo.isDeleted==true){
            req.session.message={text:`${cargo.cargoCode} kodlu kargo maalesef güncellenemiyor.`, class:"warning"};
            return res.redirect("/customer/customer-adverts")
        };
        cargo.cargoName=cargoName;
        cargo.description=description;
        cargo.weight=weight;
        cargo.verticalHeight=verticalHeight;
        cargo.horizontalHeight=horizontalHeight;
        cargo.cargoImg=cargoImg;
        await cargo.save();

        await cargo.setCargoType(cargoType);

        req.session.message={text:`${cargo.cargoCode} kodlu kargo güncellendi`, class:"success"};
        //router linkine göre güncellenecek
        return res.redirect(`/customer/customer-advert/edit/${advertId}`);


    } catch (err) {
        console.log(err);
        let message="";
        if(err.name=="SequelizeValidationError"){
            for (const e of err.errors) {
                    message += `${e.message} <br>`
            }
        }
        if(err.name=="SequelizeForeignKeyConstraintError"){
            message=`<b>Kargo Türü</b> boş geçilemez`;
        }
        req.session.message={text:message, class:"warning"};
        return res.redirect(`/customer/customer-advert/edit/${advertId}/cargo/${cargoId}`);

    }
};
exports.get_cargo_detail=async(req,res)=>{
    const message=req.session.message;
    delete req.session.message;
    const cargoCode=req.params.cargoCode;
    const userId=req.session.userID;
    const cargo=await Cargo.findOne({where:{[Op.and]:[{userId: userId},{cargoCode:cargoCode}]},include:{model:CargoType, attributes:["id", "cargoTypeName"]}});
    return res.render("admin/cargo-pages/cargo-details",{
        title:"Kargo Detayı",
        message: message,
        cargo: cargo
    })
};
exports.post_cargo_delete=async(req,res)=>{
    const cargoId=req.body.cargoId;
    const cargoCode=req.body.cargoCode;
    const userId=req.session.userID;
    //cargo is never delete because if have any problem like anti-legal cargo we must hide it for officers
    await Cargo.update({isDeleted: true},{where:{[Op.and]:[{id:cargoId},{userId: userId}]}}); 
    await CustomerAdvert.update({isDeleted: true},{where:{[Op.and]:[{id:cargoId},{userId: userId}]}})
    req.session.message={text:`${cargoCode} kodlu kargonuz silinmiştir`, class: "danger"};
    return res.redirect("/customer/cargos");
};

