const { Op, and } = require("sequelize");
const {Province, CustomerAdvert, ShipperAdvert, Cargo, CargoType, District, Voyage, Vehicle, VehicleType, Route}=require("../models/index-models");
const { sequelize } = require('../startup/db');




exports.get_homepage=async(req,res)=>{
    return res.render("user/homepage",{
        title: "Ana Sayfa"
    })
};

exports.get_adverts=async(req,res)=>{
    const advertType=req.params.advertType;//to show advert by user type
    const provinces=await Province.findAll();
    let adverts;
    // const districts=await District.findAll({include:{model: Province, attributes:["name"]}, attributes:["id", "name"]});

    if(advertType=="customer"){
         adverts=await CustomerAdvert.findAll({where:{isActive: true, isDeleted: false}, include: [{model: Cargo, include:{model:CargoType}}]});
    }else{
         adverts=await ShipperAdvert.findAll({where:{isActive: true, isDeleted: false}, include:[{model: Voyage, include:[{model: Vehicle, include:{model: VehicleType}},{model: Route}]}]});
    }
    return res.render("user/adverts",{
        title: "İlanlar",
        provinces: provinces,
        advertType: advertType,
        adverts: adverts,
        // districts: districts
    });
};

exports.post_adverts=async(req,res)=>{
    const advertType=req.params.advertType;
    let startPoint=req.body.startPoint;
    let endPoint=req.body.endPoint;
    const startDate=req.body.startDate;
    const endDate=req.body.endDate;

    try {
        if(advertType=="customer"){
            startPoint=await District.findAll({where:{provinceId: startPoint}});
            endPoint=await District.findAll({where:{provinceId: endPoint}});
            const adverts=await CustomerAdvert.findAll({where:{[Op.and]:[{startPoint: startPoint},{endPoint: endPoint}]}});
            return console.log("İlan----------->",adverts);
        }
    } catch (err) {
        console.log(err);
    }
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
            const advert=await ShipperAdvert.findAll({where:{voyageId: voyage.id}, include:[{model: Voyage, include:[{model: Vehicle, include:{model: VehicleType}},{model: Route}]}]});
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
            }, include: [{model: Cargo, include:{model:CargoType}}]
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

