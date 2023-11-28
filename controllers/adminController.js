const VehicleType=require("../models/vehicle-type");
const Vehicle=require("../models/vehicle");
const logger = require("../startup/logger");
const randomCodeGenerator=require("../public/js/randomcodeGenerator");
const randomcodeGenerator = require("../public/js/randomcodeGenerator");

//vehicle Types process
exports.post_vehicleType_create=async(req,res)=>{
    const vehicleTypeName=req.body.vehicleTypeName;
    const vehicleType=await VehicleType.create({vehicleTypeName: vehicleTypeName});
    const generatedCode=randomCodeGenerator("VHCTY", vehicleType);
    vehicleType.vehicleTypeCode=generatedCode;
    await vehicleType.save();
    req.session.message={text:`${vehicleTypeName} adlı araç türü eklendi`, class:"success"}
    return res.redirect("/admin/vehicle-types?action=create");
    
};

exports.post_vehicleType_edit=async(req,res)=>{
    const vehicleTypeId=req.body.vehicleTypeId;
    const vehicleTypeName=req.body.vehicleTypeName;

    const vehicleType=await VehicleType.findByPk(vehicleTypeId);
    vehicleType.vehicleTypeName=vehicleTypeName;
    await vehicleType.save();
    req.session.message={text:`${vehicleType.vehicleTypeCode} kodlu araç türü güncellendi`, class:"success"};
    return res.redirect("/admin/vehicle-types?action=edit");
};

exports.post_vehicleType_delete=async(req,res)=>{
    const vehicleTypeId=req.body.vehicleTypeId;
    await VehicleType.destroy({where:{id: vehicleTypeId}});
    req.session.message={text:`Araç türü silindi`, class:"danger"};
    return res.redirect("/admin/vehicle-types");
};

exports.get_vehicleTypes=async(req,res)=>{
    const vehicleTypes=await VehicleType.findAll();
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
    const vehicleTypes=await VehicleType.findAll();
    return res.render("admin/vehicle-create",{
        title: "Araç Ekle",
        vehicleTypes: vehicleTypes
    });
};

exports.post_vehicle_create=async(req,res)=>{
    const vehicleImg=req.body.vehicleImg;
    const plate=req.body.plate;
    const brand=req.body.brand;
    const capacity=req.body.capacity;
    const wheels=req.body.wheels;
    const vehicleType=req.body.vehicleType;


    const vehicle=await Vehicle.create({vehicleImg: vehicleImg, plate: plate, brand: brand, capacity: capacity, wheels: wheels});
    await vehicle.setVehicleType(vehicleType);

    let generatedCode=randomcodeGenerator("VHC", vehicle);
    vehicle.vehicleCode=generatedCode;
    await vehicle.save();

    req.session.message={text: `${generatedCode} kodlu araç eklendi`, class:"success"};

    return res.redirect("/admin/vehicles?action=create");
};

exports.get_vehicle_edit=async(req,res)=>{
    const vehicleId=req.params.vehicleId;

    const vehicle=await Vehicle.findByPk(vehicleId);
    return res.render("admin/vehicle-edit", {
        title: "Araç Düzenle",
        vehicle: vehicle
    });
};

exports.post_vehicle_edit=async(req,res)=>{
    const vehicleId=req.body.vehicleId;
    const vehicleImg=req.body.vehicleImg;
    const plate=req.body.plate;
    const brand=req.body.brand;
    const capacity=req.body.capacity;
    const wheels=req.body.wheels;

    await Vehicle.update({vehicleImg: vehicleImg, plate: plate, brand: brand, capacity: capacity, wheels: wheels},{where:{id:vehicleId}});
    req.session.message={text:`${plate} plakalı araç güncellendi`, class:"success"};

    return res.redirect("/admin/vehicles?action=edit")
};

exports.post_vehicle_delete=async(req,res)=>{
    const vehicleId=req.body.vehicleId;
    const plate=req.body.plate;

    await Vehicle.destroy({where:{id:vehicleId}});

    req.session.message={text:`${plate} plakalı araç silindi`, class:"danger"};

    return res.redirect("/admin/vehicles?action=delete");
    
};

exports.get_vehicles=async(req,res)=>{
    const message=req.session.message;
    delete req.session.message;
    const vehicles=await Vehicle.findAll();
    console.log(vehicles[0].vehicleTypeId);
    return res.render("admin/vehicles",{
        title: "Araçlarım",
        vehicles: vehicles,
        message: message
    })
};

//driver process
exports.get_driver_create=async(req,res)=>{
    res.send("get driver create page");
};

exports.post_driver_create=async(req,res)=>{
    res.send("post driver create page");
};

exports.get_driver_edit=async(req,res)=>{
    res.send("get driver edit page");
};

exports.post_driver_edit=async(req,res)=>{
    res.send("get driver edit page");
};

exports.get_driver_delete=async(req,res)=>{
    res.send("get driver delete page");
};

exports.post_driver_delete=async(req,res)=>{
    res.send("post driver delete page");
};

exports.get_drivers=async(req,res)=>{
    res.send("drivers page");
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

//route process
exports.get_route_create=async(req,res)=>{
    res.send("get route create page");
};

exports.post_route_create=async(req,res)=>{
    res.send("post route create page");
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
    res.send("routes page");
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