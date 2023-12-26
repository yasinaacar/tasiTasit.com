//models
const {District, Driver, Province, Route, User, VehicleType, Vehicle, }=require("../models/index-models");

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
        const vehicleImg=req.file ? req.file.filename: "defaultVehicle.jpg";
        const brand=req.body.brand;
        const capacity=req.body.capacity;
        const wheels=req.body.wheels;
        const vehicleTypeId=req.body.vehicleTypeId;
    
    
        const vehicle=await Vehicle.create({vehicleImg: vehicleImg, plate: plate, brand: brand, capacity: capacity, wheels: wheels});
    
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
    const plate=req.params.plate;
    const vehicle=await Vehicle.findOne({where:{url:plate},include:{model: Driver}});
    const vehicleTypes=await VehicleType.findAll();
    const drivers=await Driver.findAll({attributes:["fullname", "id"]});
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
        
            const vehicle=await Vehicle.findByPk(vehicleId,{include:{model:Driver}});
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
    const plate=req.body.plate;
    const vehicleImg=req.body.vehicleImg;
    console.log(vehicleImg)
    await Vehicle.destroy({where:{id:vehicleId}});

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
    const message=req.session.message;
    delete req.session.message;
    const vehicles=await Vehicle.findAll({include:[{model:VehicleType,  attributes:["vehicleTypeName"]},{model: Driver, attributes:["fullname"]}]});
    console.log(vehicles)
    return res.render("admin/vehicle-pages/vehicles",{
        title: "Araçlarım",
        vehicles: vehicles,
        message: message
    })
};


//route process
exports.get_route_create=async(req,res)=>{
    const provinces=await Province.findAll();
    return res.render("admin/route-create",({
        title: "Rota Oluştur",
        provinces: provinces
    }));
};
exports.post_route_create=async(req,res)=>{
    const startDistrict=req.body.startDistrict;
    const finishDistrict=req.body.finishDistrict;

    const route=await Route.create({startPoint:startDistrict, endPoint:finishDistrict});;
    return res.redirect("/admin/routes");
};
exports.get_routes=async(req,res)=>{
    const routes=await Route.findAll({include:{model:District}});
    return res.render("admin/routes",{
        title: "Rotalar",
        routes: routes
    });
};
