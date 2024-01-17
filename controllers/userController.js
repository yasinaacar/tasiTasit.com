const { Op } = require("sequelize");
const {Province, CustomerAdvert, ShipperAdvert, Cargo, CargoType, District, Voyage, Vehicle, VehicleType, Route}=require("../models/index-models");



exports.get_homepage=async(req,res)=>{
    return res.render("user/homepage",{
        title: "Ana Sayfa"
    })
};

exports.get_adverts=async(req,res)=>{
    const advertType=req.params.advertType;//to show advert by user type
    const provinces=await Province.findAll();
    let adverts;
    const districts=await District.findAll({include:{model: Province, attributes:["name"]}, attributes:["id", "name"]});

    if(advertType=="customer"){
         adverts=await CustomerAdvert.findAll({where:{isActive: true, isDeleted: false}, include: [{model: Cargo, include:{model:CargoType}}]});
    }else{
         adverts=await ShipperAdvert.findAll({where:{isActive: true, isDeleted: false}, include:[{model: Voyage, include:[{model: Vehicle, include:{model: VehicleType}},{model: Route}]}]});
    }
    console.log(adverts[0].voyage)
    return res.render("user/adverts",{
        title: "İlanlar",
        provinces: provinces,
        advertType: advertType,
        adverts: adverts,
        districts: districts
    });
};

exports.post_adverts=async(req,res)=>{
    const advertType=req.params.advertType;
    const startPoint=req.body.startPoint;
    const endPoint=req.body.endPoint;
    const startDate=req.body.startDate;
    const endDate=req.body.endDate;

    console.log("Advert Type----------->",advertType);
    console.log("Start Point----------->",startPoint);
    console.log("End Point----------->",endPoint);
    console.log("Start Date----------->",startDate);
    console.log("End Date----------->",endDate);

    try {

    } catch (err) {
        console.log(err);
    }
};