const VehicleType=require("../models/vehicle-type");
const Vehicle=require("../models/vehicle");
const Driver=require("../models/driver");
const District=require("../models/district");
const Province=require("../models/province");
const Route=require("../models/route");
const logger = require("../startup/logger");
const randomCodeGenerator=require("../public/js/randomcodeGenerator");
const slugfield=require("../helpers/slugfield");
const fs=require("fs");
const { Op } = require("sequelize");


//vehicle Types process
exports.post_vehicleType_create=async(req,res)=>{
    const vehicleTypeName=req.body.vehicleTypeName;
    try {
        const vehicleType=await VehicleType.create({vehicleTypeName: vehicleTypeName});
        vehicleType.url=slugfield(vehicleTypeName);
        const generatedCode=randomCodeGenerator("VHCTY", vehicleType);
        vehicleType.vehicleTypeCode=generatedCode;
        await vehicleType.save();
        req.session.message={text:`${vehicleTypeName} adlı araç türü eklendi`, class:"success"}
        return res.redirect("/admin/vehicle-types?action=create");
        
    } catch (err) {
        console.log(err)
        if(err.name=="SequelizeUniqueConstraintError"){
            req.session.message={text:`${vehicleTypeName} adında araç türü zaten kayıtlı`, class:"warning"};
            return res.redirect("/admin/vehicle-types");
        }
        if(err.name="SequelizeValidationError"){
            req.session.message={text:"Araç Türü Adının uzunluğu mininmum 2 maksimum 30 karakter içermeli ve boş geçilemez", class:"warning"};
            return res.redirect("/admin/vehicle-types");
        }

    }
    
};
exports.get_vehicleType_edit=async(req,res)=>{
    const message=req.session.message;
    delete req.session.message;
    const slug=req.params.slug;
    const vehicleType=await VehicleType.findOne({where:{url: slug}});
    const vehicleTypeId=vehicleType.id
    const vehicles=await Vehicle.findAll({where:{vehicleTypeId: vehicleTypeId}});
    return res.render("admin/vehicle-type-edit",{
        title: "Araç Türü Düzenle",
        vehicleType: vehicleType,
        vehicles: vehicles,
        message: message
    })
};
exports.post_vehicleType_edit=async(req,res)=>{
    const vehicleTypeId=req.body.vehicleTypeId;
    const vehicleTypeName=req.body.vehicleTypeName;

    const vehicleType=await VehicleType.findByPk(vehicleTypeId);
    vehicleType.vehicleTypeName=vehicleTypeName;
    vehicleType.url=slugfield(vehicleTypeName);
    await vehicleType.save();
    req.session.message={text:`${vehicleType.vehicleTypeCode} kodlu araç türü güncellendi`, class:"success"};
    return res.redirect("/admin/vehicle-types?action=edit");
};
exports.post_remove_vehicle_from_vehicleType=async(req,res)=>{
    const vehicleId=req.body.vehicleId;
    const plate=req.body.plate;
    const vehicleTypeUrl=req.body.vehicleTypeUrl;

    const vehicle=await Vehicle.findByPk(vehicleId);
    vehicle.vehicleTypeId=null;
    await vehicle.save();
    req.session.message={text:`${plate} plakalı araç kaldırıldı`, class:"warning"};
    return res.redirect(`/admin/vehicle-type/edit/${vehicleTypeUrl}`);
}
exports.post_vehicleType_delete=async(req,res)=>{
    const vehicleTypeId=req.body.vehicleTypeId;
    await VehicleType.destroy({where:{id: vehicleTypeId}});
    req.session.message={text:`Araç türü silindi`, class:"danger"};
    return res.redirect("/admin/vehicle-types");
};
exports.get_vehicleTypes=async(req,res)=>{
    const vehicleTypes=await VehicleType.findAll({include:{model: Vehicle}});
    const message=req.session.message;
    delete req.session.message;
    return res.render("admin/vehicle-types",{
        title: "Araç Türleri",
        message: message,
        vehicleTypes: vehicleTypes,
    });
};

//vehicle process
exports.get_vehicle_create=async(req,res)=>{
    const message=req.session.message;
    delete req.session.message
    const vehicleTypes=await VehicleType.findAll();
    return res.render("admin/vehicle-create",{
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
    
        let generatedCode=randomCodeGenerator("VHC", vehicle);
        vehicle.url=slugfield(plate);
        vehicle.vehicleCode=generatedCode;
        vehicleTypeId=="-1" ? vehicle.vehicleTypeId=null : vehicle.vehicleTypeId=vehicleTypeId;
        await vehicle.save();
    
        req.session.message={text: `${plate} plakalı araç eklendi`, class:"success"};
    
        return res.redirect("/admin/vehicles?action=create");
        
    } catch (err) {
        console.log(err)
        if(err.name=="SequelizeUniqueConstraintError"){
            req.session.message={text:`${plate} plakalı bir araç zaten sistemde mevcut`, class:"warning"}
            return res.redirect("/admin/vehicle/create");
        }
        
        if(err.name=="SequelizeDatabaseError"){
            req.session.message={text:`Kapasite ve teker sayısı boş geçilemez `, class:"warning"}
            return res.redirect("/admin/vehicle/create");
        }
    }
};
exports.get_vehicle_edit=async(req,res)=>{
    const vehicleId=req.params.vehicleId;
    const vehicle=await Vehicle.findByPk(vehicleId,{include:{model: Driver, attributes:["id"]}});
    console.log(vehicle)
    const vehicleTypes=await VehicleType.findAll();
    const drivers=await Driver.findAll({attributes:["fullname", "id"]})
    return res.render("admin/vehicle-edit", {
        title: "Araç Düzenle",
        vehicle: vehicle,
        vehicleTypes:vehicleTypes,
        drivers: drivers
    });
};
exports.post_vehicle_edit=async(req,res)=>{
    const vehicleId=req.body.vehicleId;
    let vehicleImg=req.body.vehicleImg;
    const plate=req.body.plate;
    const brand=req.body.brand;
    const capacity=req.body.capacity;
    const wheels=req.body.wheels;
    const vehicleTypeId=req.body.vehicleTypeId;
    const driverIds=req.body.driverIds;
    console.log("drivers------->", driverIds)
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
        vehicle.plate=plate;
        vehicle.brand=brand;
        vehicle.capacity=capacity;
        vehicle.wheels=wheels;
        if(vehicleTypeId=="-1"){
            vehicle.vehicleTypeId=null;
            await vehicle.save();
            req.session.message={text:`${plate} plakalı araç güncellendi`, class:"success"};
            return res.redirect("/admin/vehicles?action=edit")
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
        return res.redirect("/admin/vehicles?action=edit")
    }

    return res.redirect("/admin/vehicles")

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

    return res.redirect("/admin/vehicles?action=delete");
    
};
exports.get_vehicles=async(req,res)=>{
    const message=req.session.message;
    delete req.session.message;
    const vehicles=await Vehicle.findAll({include:[{model:VehicleType,  attributes:["vehicleTypeName"]},{model: Driver, attributes:["fullname"]}]});
    console.log(vehicles)
    return res.render("admin/vehicles",{
        title: "Araçlarım",
        vehicles: vehicles,
        message: message
    })
};

//driver process
exports.get_driver_create=async(req,res)=>{
    const message=req.session.message;
    delete req.session.message;
    return res.render("admin/driver-create",{
        title: "Şoför Ekle",
        message: message
    })
};
exports.post_driver_create=async(req,res)=>{
    try {
        const driverImg=req.file ? req.file.filename:"defaultDriver.jpg";
        const fullname=req.body.fullname;
        const telephone=req.body.telephone;
        const email=req.body.email;
        const gender=req.body.gender=="-1" ? null: req.body.gender;
        const url=slugfield(fullname);

        const driver=await Driver.create({
            driverImg: driverImg,
            fullname: fullname,
            telephone: telephone,
            email: email,
            gender: gender,
            url: url
        });

        driver.driverCode=randomCodeGenerator("DRV", driver);
        await driver.save();


        req.session.message={text:`${fullname} adlı soför eklendi`, class:"success"};
        return res.redirect("/admin/drivers");

    } catch (err) {
        console.log(err);
        if(err.name=="SequelizeUniqueConstraintError"){
            req.session.message={text:"Telefon Numarası ya da E-Posta zaten sistemde mevcut", class:"warning"};
            return res.redirect("/admin/driver/create");
        }
    }
};
exports.get_driver_edit=async(req,res)=>{
    const driverId=req.params.id;
    const message=req.session.message;
    delete req.session.message;
    const driver=await Driver.findByPk(driverId,{attributes:["driverImg", "fullname", "telephone", "id", "email", "gender"]});
    return res.render("admin/driver-edit",{
        title: "Şoför Güncelle",
        driver: driver,
        message: message
    })
};
exports.post_driver_edit=async(req,res)=>{
    const driverId=req.body.driverId;
    const slug=req.params.slug;
    try {
        let driverImg=req.body.driverImg;
        const fullname=req.body.fullname;
        const telephone=req.body.telephone;
        const email=req.body.email;
        const gender=req.body.gender=="-1" ? null: req.body.gender;

        if(req.file){
            driverImg=req.file.filename;
    
            if(req.body.driverImg!="defaultVehicle.jpg"){
                fs.unlink("./public/images/"+req.body.driverImg,err=>{
                    if(err){
                        logger.error(`Şoför resmi güncellendi ancak eski şoför resmi silinemedi. Silinemeyen resim: ${req.body.driverImg},${err}`);
                    }
                })
            }
            
        }

        const driver=await Driver.findByPk(driverId);
        driver.driverImg=driverImg;
        driver.fullname=fullname;
        driver.telephone=telephone;
        driver.email=email;
        driver.gender=gender;
        driver.url=slugfield(fullname);
        await driver.save();

        req.session.message={text:`${fullname} adlı şoför bilgileri güncellendi`, class:"success"};
        return res.redirect("/admin/drivers");

    } catch (err) {
        console.log(err);
        if(err.name=="SequelizeUniqueConstraintError"){
            req.session.message={text:"Telefon Numarası ya da E-Posta zaten sistemde mevcut", class:"warning"};
            return res.redirect(`/admin/driver/edit/${driverId}/${slug}`);
        }
    }
};
exports.post_driver_delete=async(req,res)=>{
    const driverId=req.body.driverId;
    const driverImg=req.body.driverImg;

    if(driverImg!="defaultDriver.jpg"){
        fs.unlink("/public/images/"+driverImg,err=>{
            fs.unlink("./public/images/"+req.body.driverImg,err=>{
                if(err){
                    logger.error(`Şoför silindi ancak resmi silinemedi. Silinemeyen resim: ${driverImg},${err}`);
                }
            })
        })
    }

    await Driver.destroy({where:{id:driverId}});

    req.session.message={text:"Soför silindi", class:"danger"};
    return res.redirect("/admin/drivers");
};
exports.get_drivers=async(req,res)=>{
    const message=req.session.message;
    delete req.session.message;
    const drivers=await Driver.findAll();
    return res.render("admin/drivers",{
        title: "Şöförler",
        message: message,
        drivers: drivers
    });
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

exports.get_route_edit=async(req,res)=>{
    res.send("get route edit page");
};

exports.post_route_edit=async(req,res)=>{
    res.send("get route edit page");
};

exports.get_route_delete=async(req,res)=>{
    res.send("get route delete page");
};

exports.post_route_delete=async(req,res)=>{
    res.send("post route delete page");
};

exports.get_routes=async(req,res)=>{
    const routes=await Route.findAll({include:{model:District}});
    return res.render("admin/routes",{
        title: "Rotalar",
        routes: routes
    });
};


//voyage process
exports.get_voyage_create=async(req,res)=>{
    res.send("get voyage create page");
};

exports.post_voyage_create=async(req,res)=>{
    res.send("post voyage create page");
};

exports.get_voyage_edit=async(req,res)=>{
    res.send("get voyage edit page");
};

exports.post_voyage_edit=async(req,res)=>{
    res.send("get voyage edit page");
};

exports.get_voyage_delete=async(req,res)=>{
    res.send("get voyage delete page");
};

exports.post_voyage_delete=async(req,res)=>{
    res.send("post voyage delete page");
};

exports.get_voyages=async(req,res)=>{
    res.send("voyages page");
};



//cargo process
exports.get_cargo_create=async(req,res)=>{
    res.send("get cargo create page");
};

exports.post_cargo_create=async(req,res)=>{
    res.send("post cargo create page");
};

exports.get_cargo_edit=async(req,res)=>{
    res.send("get cargo edit page");
};

exports.post_cargo_edit=async(req,res)=>{
    res.send("get cargo edit page");
};

exports.get_cargo_delete=async(req,res)=>{
    res.send("get cargo delete page");
};

exports.post_cargo_delete=async(req,res)=>{
    res.send("post cargo delete page");
};

exports.get_cargos=async(req,res)=>{
    res.send("cargos page");
};

//shipper advert process
exports.get_shipper_advert_create=async(req,res)=>{
    res.send("get shipper_advert create page");
};

exports.post_shipper_advert_create=async(req,res)=>{
    res.send("post shipper_advert create page");
};

exports.get_shipper_advert_edit=async(req,res)=>{
    res.send("get shipper_advert edit page");
};

exports.post_shipper_advert_edit=async(req,res)=>{
    res.send("get shipper_advert edit page");
};

exports.get_shipper_advert_delete=async(req,res)=>{
    res.send("get shipper_advert delete page");
};

exports.post_shipper_advert_delete=async(req,res)=>{
    res.send("post shipper_advert delete page");
};

exports.get_shipper_adverts=async(req,res)=>{
    res.send("shipper_adverts page");
};

//customer advert process
exports.get_customer_advert_create=async(req,res)=>{
    res.send("get customer_advert create page");
};

exports.post_customer_advert_create=async(req,res)=>{
    res.send("post customer_advert create page");
};

exports.get_customer_advert_edit=async(req,res)=>{
    res.send("get customer_advert edit page");
};

exports.post_customer_advert_edit=async(req,res)=>{
    res.send("get customer_advert edit page");
};

exports.get_customer_advert_delete=async(req,res)=>{
    res.send("get customer_advert delete page");
};

exports.post_customer_advert_delete=async(req,res)=>{
    res.send("post customer_advert delete page");
};

exports.get_customer_adverts=async(req,res)=>{
    res.send("customer_adverts page");
};

//offer process
exports.get_offer_create=async(req,res)=>{
    res.send("get offer create page");
};

exports.post_offer_create=async(req,res)=>{
    res.send("post offer create page");
};

exports.get_offer_edit=async(req,res)=>{
    res.send("get offer edit page");
};

exports.post_offer_edit=async(req,res)=>{
    res.send("get offer edit page");
};

exports.get_offer_delete=async(req,res)=>{
    res.send("get offer delete page");
};

exports.post_offer_delete=async(req,res)=>{
    res.send("post offer delete page");
};

exports.get_offers=async(req,res)=>{
    res.send("offers page");
};