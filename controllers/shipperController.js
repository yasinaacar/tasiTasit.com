//models
const {District, Driver, Province, Route, User, VehicleType, Vehicle, Voyage, VehicleDriver, ShipperAdvert }=require("../models/index-models");

//helpers
const {transporter, slugfield, randomCodeGenerator}=require("../helpers/index-helpers");

const logger = require("../startup/logger");
const fs=require("fs");
const { Op } = require("sequelize");



//vehicle process
exports.get_vehicle_create=async(req,res)=>{
    const message=req.session.message;
    delete req.session.message
    const vehicleTypes=await VehicleType.findAll();
    return res.render("admin/vehicle-pages//vehicle-create",{
        title: "Araç Ekle",
        vehicleTypes: vehicleTypes,
        message: message
    });
};
exports.post_vehicle_create=async(req,res)=>{
    const plate=req.body.plate;
    try {
        const vehicleImg=req.file ? req.file.filename:"defaultVehicle.jpg";
        const brand=req.body.brand;
        const capacity=req.body.capacity;
        const wheels=req.body.wheels;
        const vehicleTypeId=req.body.vehicleTypeId;
        const userId=req.session.userID;
        
    
        const vehicle=await Vehicle.create({vehicleImg: vehicleImg, plate: plate, brand: brand, capacity: capacity, wheels: wheels, userId:userId});
    
        let generatedCode=await randomCodeGenerator("VHC", vehicle);
        vehicle.url=slugfield(plate);
        vehicle.vehicleCode=generatedCode;
        vehicleTypeId=="-1" ? vehicle.vehicleTypeId=null : vehicle.vehicleTypeId=vehicleTypeId;
        await vehicle.save();
        req.session.message={text: `${plate} plakalı araç eklendi`, class:"success"};
    
        return res.redirect("/shipper/vehicles?action=create");
        
    } catch (err) {
        let message="";
        if(err.name=="SequelizeValidationError"){
            for (const e of err.errors) {
                message += `${e.message} <br>`
            }
            req.session.message={text: message, class:"warning"}
        }
        else if(err.name=="SequelizeUniqueConstraintError"){
            req.session.message={text:`${plate} plakalı bir araç zaten sistemde mevcut`, class:"danger"}
        }       
        else{
            logger.error(err.message);
            return res.render("errors/500",{title: "500"});
        }

        return res.redirect("/shipper/vehicle/create");
    }
};
exports.get_vehicle_edit=async(req,res)=>{
    const userId=req.session.userID;
    const plate=req.params.plate;
    const vehicle=await Vehicle.findOne({where:{[Op.and]:[{userId: userId},{url:plate}]},include:{model: Driver}});
    const vehicleTypes=await VehicleType.findAll();
    const drivers=await Driver.findAll({where:{userId: userId},attributes:["fullname", "id"]});
    const message=req.session.message;
    delete req.session.message;
    return res.render("admin/vehicle-pages/vehicle-edit", {
        title: "Araç Düzenle",
        vehicle: vehicle,
        vehicleTypes:vehicleTypes,
        drivers: drivers,
        message: message
    });
};
exports.post_vehicle_edit=async(req,res)=>{
    const url=req.params.plate;
    const plate=req.body.plate;

    try {
        const vehicleId=req.body.vehicleId;
        let vehicleImg=req.body.vehicleImg;
        const brand=req.body.brand;
        const capacity=req.body.capacity;
        const wheels=req.body.wheels;
        const vehicleTypeId=req.body.vehicleTypeId;
        const driverIds=req.body.driverIds;
        
            if(req.file){
                vehicleImg=req.file.filename;
        
                if(req.body.vehicleImg!="defaultVehicle.jpg"){
                    fs.unlink("./public/images/"+req.body.vehicleImg,err=>{
                        if(err){
                            logger.error(`Araç resmi güncellendi ancak eski araç resmi silinemedi. Silinemeyen resim: ${req.body.vehicleImg},${err}`);
                        }
                    })
                }
                
            }
        
            const userId=req.session.userID;
            const vehicle=await Vehicle.findOne({where:{[Op.and]:[{userId:userId},{id:vehicleId}]},include:{model:Driver}});
            if(vehicle){
                vehicle.vehicleImg=vehicleImg;
                vehicle.plate=plate.toUpperCase();
                vehicle.brand=brand;
                vehicle.capacity=capacity;
                vehicle.wheels=wheels;
                vehicle.url=slugfield(plate)
                if(vehicleTypeId=="-1"){
                    vehicle.vehicleTypeId=null;
                    await vehicle.save();
                    req.session.message={text:`${plate} plakalı araç güncellendi`, class:"success"};
                    return res.redirect("/shipper/vehicles?action=edit")
                }
                vehicle.vehicleTypeId=vehicleTypeId;
                if(driverIds==undefined){
                    await vehicle.removeDrivers(vehicle.drivers);
                }else{
                    await vehicle.removeDrivers(vehicle.drivers);
                    const selectedCategories=await Driver.findAll({
                        where:{id:{[Op.in]:driverIds}}
                    });
        
                    await vehicle.addDrivers(selectedCategories);
                }
                await vehicle.save();
                
                req.session.message={text:`${plate} plakalı araç güncellendi`, class:"success"};
                return res.redirect("/shipper/vehicles?action=edit")
            }
        
            return res.redirect("/shipper/vehicles")
        
    } catch (err) {
        let message="";
        if(err.name=="SequelizeValidationError"){
            for (const e of err.errors) {
                message += `${e.message} <br>`
            }
            req.session.message={text: message, class:"warning"}
        }
        else if(err.name=="SequelizeUniqueConstraintError"){
            req.session.message={text:`${plate} plakalı bir araç zaten sistemde mevcut`, class:"danger"}
        }       
        else{
            logger.error(err.message);
            return res.render("errors/500",{title: "500"});
        }
        return res.redirect("/shipper/vehicle/edit/"+url);
    }

};
exports.post_vehicle_delete=async(req,res)=>{
    const vehicleId=req.body.vehicleId;
    const userId=req.session.userID;
    const plate=req.body.plate;
    const vehicleImg=req.body.vehicleImg;
    console.log(vehicleImg)
    await Vehicle.destroy({where:{[Op.and]:[{userId:userId},{id:vehicleId}]}});

    if(vehicleImg!="defaultVehicle.jpg"){
        fs.unlink("/public/images/"+vehicleImg,err=>{
            fs.unlink("./public/images/"+req.body.vehicleImg,err=>{
                if(err){
                    logger.error(`Araç silindi ancak resmi silinemedi. Silinemeyen resim: ${vehicleImg},${err}`);
                }
            })
        })
    }

    req.session.message={text:`${plate} plakalı araç silindi`, class:"danger"};

    return res.redirect("/shipper/vehicles?action=delete");
    
};
exports.get_vehicles=async(req,res)=>{
    const userId=req.session.userID;
    const message=req.session.message;
    delete req.session.message;
    const vehicles=await Vehicle.findAll({where:{userId:userId},include:[{model:VehicleType,  attributes:["vehicleTypeName"]},{model: Driver, attributes:["fullname"]}],order: [['createdAt', 'DESC']]});
    return res.render("admin/vehicle-pages/vehicles",{
        title: "Araçlarım",
        vehicles: vehicles,
        message: message
    })
};


//route process
exports.get_route_create=async(req,res)=>{
    const message=req.session.message;
    delete req.session.message;
    const provinces=await Province.findAll();
    return res.render("admin/route-pages/route-create",({
        title: "Rota Oluştur",
        provinces: provinces,
        message: message
    }));
};
exports.post_route_create=async(req,res)=>{
    try {        
        const startPoint=req.body.startPoint;
        const startDistrict=req.body.startDistrict;
        const endPoint=req.body.endPoint;
        const endDistrict=req.body.endDistrict;
        let visitPoints=req.body.visitPoint == "-1" ? null : req.body.visitPoint;
        if(startDistrict==endDistrict){
            req.session.message={text:"Başlangıç ve Bitiş noktaları aynı olamaz veya boş geçilemez", class:"warning"};
            return res.redirect(`/shipper/shipper-advert/create/route`)
        }
        if(visitPoints && visitPoints.length>0){;
            if(visitPoints.includes(startPoint) || visitPoints.includes(endPoint)){
                req.session.message={text:"Başlangıç veya Bitiş noktalarını durak/güzergah olarak ekleyemezsiniz.", class:"warning"};
                return res.redirect(`/shipper/shipper-advert/create/route/`)
            }
        }
        const userId=req.session.userID;
        const route=await Route.create({startPoint: startPoint, startDistrict: startDistrict,endPoint: endPoint, endDistrict: endDistrict, visitPoints: visitPoints, userId: userId});
        route.routeCode=await randomCodeGenerator("ROT",route);
        await route.save();
        return res.redirect(`/shipper/shipper-advert/create/route/${route.id}/voyage`);
    } catch (err) {
        let message= "";
        console.log(err)
        if(err.name=="SequelizeValidationError"){
            for (const e of err.errors) {
                message += `${e.message} <br>`
            }
        }else{
            logger.error(err.message);
            return res.render("errors/500",{title: "500"});
        }
        
        req.session.message={text: message, class:"danger"}
        return res.redirect("/shipper/shipper-advert/create/route");
    }

    
};
exports.get_route_edit=async(req,res)=>{
    const message=req.session.message;
    delete req.session.message;
    const routeId=req.params.routeId;
    const userId=req.session.userID;
    const route=await Route.findOne({where:{[Op.and]:[{userId: userId},{id: routeId}]},raw:true});
    const startPoint=await District.findOne({where:{id:route.startDistrict},include:{model:Province}});
    const endPoint=await District.findOne({where:{id:route.endDistrict},include:{model:Province}});
    const provinces=await Province.findAll();
    let visitPoints=route.visitPoints;

    return res.render("admin/route-pages/route-edit",({
        title: "Rota Düzenle",
        startPoint: startPoint,
        endPoint: endPoint,
        visitPoints: visitPoints,
        route: route,
        provinces: provinces,
        message: message
    }));
};
exports.post_route_edit=async(req,res)=>{
    const routeId=req.body.routeId;
    const advertId=req.params.advertId;
    const userId=req.session.userID;
    try {        
        const startPoint=req.body.startPoint;
        const startDistrict=req.body.startDistrict;
        const endPoint=req.body.endPoint;
        const endDistrict=req.body.endDistrict;
        if(startPoint==endPoint){
            req.session.message={text:"Başlangıç ve Bitiş noktaları aynı olamaz", class:"warning"};
            return res.redirect(`/shipper/shipper-advert/edit/advertid/${advertId}/routeid/${routeId}`);
        }
        let visitPoints=req.body.visitPoint == "-1" ? null : req.body.visitPoint;
        if(visitPoints.includes(startPoint) || visitPoints.includes(endPoint)){
            req.session.message={text:"Başlangıç veya Bitiş noktalarını durak/güzergah olarak ekleyemezsiniz.", class:"warning"};
            return res.redirect(`/shipper/shipper-advert/edit/advertid/${advertId}/routeid/${routeId}`)
        }
        //update on database
        const route=await Route.findOne({where:{[Op.and]:[{userId: userId},{id: routeId}]},include:{model:Voyage}});
        route.startPoint=startPoint;
        route.startDistrict=startDistrict;
        route.endPoint=endPoint;
        route.endDistrict=endDistrict;
        route.visitPoints=visitPoints;
        await route.save();

        req.session.message={text: `<b>${route.routeCode}</b> kodlu rota güncellendi`, class:"primary"}
        return res.redirect(`/shipper/shipper-advert/edit/advertid/${advertId}/routeid/${routeId}/voyageid/${route.voyage.id}`);
    } catch (err) {
        let message= "";
        console.log(err);
        if(err.name=="SequelizeValidationError"){
            for (const e of err.errors) {
                message += `${e.message} <br>`
            }
            req.session.message={text: message, class:"danger"}
        }else{
            logger.error(err.message);
            return res.render("errors/500",{title: "500"});
        }

        return res.redirect(`/shipper/shipper-advert/edit/advertid/${advertId}/routeid/${routeId}`);
    }
};

//voyage process
exports.get_voyage_create=async(req,res)=>{
    const routeId=req.params.routeId;
    const userId=req.session.userID;
    const message=req.session.message;
    delete req.session.message;
    const vehicles=await Vehicle.findAll({where:{userId:userId},include:[{model:VehicleType,  attributes:["vehicleTypeName"]},{model: Driver, attributes:["fullname"]}]});
    const route=await Route.findByPk(routeId,{attributes:["id"]});
    return res.render("admin/voyage-pages/voyage-create", {
        title: "Sefer Oluştur",
        message: message,
        vehicles: vehicles,
        route: route
    })
};
exports.post_voyage_create=async(req,res)=>{
    const routeId=req.body.routeId;
    const userId=req.session.userID;
    try {
        const startDate=req.body.startDate;
        const endDate=req.body.endDate;
        const vehicleId=req.body.vehicleId;
        const voyage=await Voyage.create({startDate: startDate, endDate: endDate, vehicleId: vehicleId, routeId: routeId, userId:userId});
        voyage.voyageCode=await randomCodeGenerator("VYG", voyage);
        await voyage.save(); 
        req.session.message={text:`${voyage.voyageCode} kodlu sefer oluşturuldu`, class:"success"}
        return res.redirect(`/shipper/shipper-advert/create/route/${routeId}/voyage/${voyage.id}/advert`)
    } catch (err) {
        let message= "";
        if(err.name=="SequelizeValidationError"){
            for (const e of err.errors) {
                message += `${e.message} <br>`
            }
            req.session.message={text: message, class:"danger"}
        }else{
            logger.error(err.message);
            return res.render("errors/500",{title: "500"});
        }

        return res.redirect(`/shipper/shipper-advert/create/route/${routeId}/voyage`);
    }
    
};
exports.get_voyage_edit=async(req,res)=>{
    const routeId=req.params.routeId;
    const userId=req.session.userID;
    const message=req.session.message;
    delete req.session.message;
    const vehicles=await Vehicle.findAll({where:{userId: userId},include:[{model:VehicleType,  attributes:["vehicleTypeName"]},{model: Driver, attributes:["fullname"]}]});
    const voyage=await Voyage.findOne({where:{[Op.and]:[{routeId: routeId},{userId:userId}]}});
    return res.render("admin/voyage-pages/voyage-edit", {
        title: "Sefer Düzenle",
        message: message,
        vehicles: vehicles,
        voyage: voyage
    })
};
exports.post_voyage_edit=async(req,res)=>{
    const routeId=req.body.routeId;
    const advertId=req.params.advertId;
    const voyageId=req.body.voyageId;
    const userId=req.session.userID;
    try {
        let voyage=await Voyage.findOne({where:{[Op.and]:[{userId: userId},{id: voyageId}]}});
        if(voyage){
            const startDate=req.body.startDate;
            const endDate=req.body.endDate;
            const vehicleId=req.body.vehicleId;

            voyage.startDate=startDate;
            voyage.endDate=endDate;
            voyage.vehicleId=vehicleId;
            await voyage.save();

            req.session.message={text:`${voyage.voyageCode} kodlu sefer başarıyla güncellendi`, class: "primary"};
            return res.redirect("/shipper/shipper-advert/edit/advertid/"+advertId);
        }else{
            
            req.session.message={text:`${voyage.voyageCode} kodlu sefer bulunamdı. Lütfen Tekrar deneyin`, class: "danger"};
            return res.redirect(`/shipper/shipper-advert/edit/advertid/${advertId}/routeid/${routeId}/voyageid/${voyageId}`);
        }
        
    } catch (err) {
        console.log(err);
        let message= "";
        if(err.name=="SequelizeValidationError"){
            for (const e of err.errors) {
                message += `${e.message} <br>`
            }
            req.session.message={text: message, class:"danger"}
        }else{
            logger.error(err.message);
            return res.render("errors/500",{title: "500"});
        }

        return res.redirect(`/shipper/shipper-advert/edit/advertid/${advertId}/routeid/${routeId}/voyageid/${voyageId}`);
    }
};
exports.post_voyage_delete=async(req,res)=>{
    const voyageId=req.body.voyageId;
    const userId=req.session.userID;
    let voyage=await Voyage.findOne({where:{[Op.and]:[{id:voyageId},{userId: userId}]}});
    if(voyage){
        voyage.isDeleted=true;
        await voyage.save();
        let advert=await ShipperAdvert.findOne({where:{[Op.and]:[{voyageId:voyageId},{userId: userId}]}});
        advert.isDeleted=true;
        await advert.save();
        req.session.message={text:`${voyage.voyageCode} kodlu sefer ve sefer ile ilişkili ${advert.advertCode} kodlu ilan silindi`, class:"danger"};
        return res.redirect("/shipper/voyages");
    }
};

//shipper-advert
exports.get_shipper_advert_create=async(req,res)=>{
    const voyageId=req.params.voyageId;
    const userId=req.session.userID;
    const message=req.session.message;
    delete req.session.message;
    const voyage=await Voyage.findOne({where:{[Op.and]:[{userId: userId},{id:voyageId}]}});
    console.log(voyage)
    return res.render("admin/shipper-advert/shipper-advert-create",{
        title: "Nakliyeci İlanı",
        voyage: voyage,
        message: message
    });
};
exports.post_shipper_advert_create=async(req,res)=>{
    const voyageId=req.body.voyageId;
    try {
        const title=req.body.title;
        const description=req.body.description;
        const isActive=req.body.isActive=="on" ? true : false;
        const userId=req.session.userID;


        const advert=await ShipperAdvert.create({title: title, description: description, voyageId: voyageId, isActive: isActive, userId:userId});
        advert.advertCode=await randomCodeGenerator("ADVSHP", advert);
        advert.save();

        req.session.message={text:`${advert.advertCode} kodlu <b>yük taşıma</b> ilanı başarıyla oluşturuldu`, class:"success"};
        return res.redirect("/shipper/shipper-adverts?action=create");
    } catch (err) {
        let message="";
        if(err.name=="SequelizeValidationError"){
            for (const e of err.errors) {
                message += `${e.message} <br>`
            }
            req.session.message={text: message, class:"warning"};
            const routeId=req.params.routeId;
            return res.redirect(`/shipper/shipper-advert/create/route/${routeId}/voyage/${voyageId}/advert`);
        }else{
            logger.error(err.message);
            return res.render("errors/500",{title: "500"});
        }

    }
};
exports.get_shipper_advert_edit=async(req,res)=>{
    const advertId=req.params.advertId;
    const userId=req.session.userID;
    const message=req.session.message;
    delete req.session.message;
    const advert=await ShipperAdvert.findOne({where:{[Op.and]:[{userId: userId},{id: advertId}]}});
    return res.render("admin/shipper-advert/shipper-advert-edit",{
        title: "Nakliyeci İlanı Düzenle",
        advert: advert,
        message: message
    });
};
exports.post_shipper_advert_edit=async(req,res)=>{
    const advertId=req.body.advertId;
    const userId=req.session.userID;

    try {
        let advert=await ShipperAdvert.findOne({where:{[Op.and]:[{userId:userId},{id: advertId}]}});
        if(advert){
            const title=req.body.title;
            const description=req.body.description;
            const isActive=req.body.isActive=="on" ? true : false;

            advert.title= title;
            advert.description=description;
            advert.isActive= isActive;
            await advert.save();

            req.session.message={text:`${advert.advertCode} kodlu <b>yük taşıma</b> ilanı başarıyla gücellendi`, class:"primary"};
            return res.redirect("/shipper/shipper-adverts?action=edit");
        }
    } catch (err) {
        let message="";
        if(err.name=="SequelizeValidationError"){
            for (const e of err.errors) {
                message += `${e.message} <br>`
            }
            req.session.message={text: message, class:"warning"};
            return res.redirect(`/shipper/shipper-advert/edit/advertid/${advertId}`);
        }else{
            logger.error(err.message);
            return res.render("errors/500",{title: "500"});
        }

    }
};
exports.post_shipper_advert_delete=async(req,res)=>{
    const advertId=req.body.advertId;
    const userId=req.session.userID;

    let advert=await ShipperAdvert.findOne({where:{[Op.and]:[{id:advertId},{userId: userId}]}});
    if(advert){
        advert.isDeleted=true;
        await advert.save();
        let voyage=await Voyage.findOne({where:{id:advert.voyageId}});
        voyage.isDeleted=true;
        await voyage.save();
        req.session.message={text:`${advert.advertCode} kodlu ilan ve ilan ile ilişkili ${voyage.voyageCode} kodlu sefer silindi`, class:"danger"};
        return res.redirect("/shipper/shipper-adverts");
    }
};
exports.get_shipper_adverts=async(req,res)=>{
    const message= req.session.message;
    delete req.session.message;
    const userId=req.session.userID;
    const adverts=await ShipperAdvert.findAll({where:{[Op.and]:[{isDeleted: false},{userId: userId}]}, include:[{model: Voyage, include:[{model: Route},{model: Vehicle, include:[{model: Driver}]}]}]},{order: [['createdAt', 'DESC']]});
    const districts=await District.findAll({include:{model: Province, attributes:["name"]}, attributes:["id", "name"]});

    return res.render("admin/shipper-advert/shipper-adverts",{
        title: "İlanlarım",
        message: message,
        adverts: adverts,
        districts: districts
    });
};