//models
const {Driver,VehicleType, Vehicle }=require("../models/index-models");

//helpers
const {transporter, slugfield, randomCodeGenerator}=require("../helpers/index-helpers");

const logger = require("../startup/logger");
const fs=require("fs");
const { Op } = require("sequelize");




//driver process
exports.get_driver_create=async(req,res)=>{
    const message=req.session.message;
    delete req.session.message;
    return res.render("admin/driver-pages/driver-create",{
        title: "Şoför Ekle",
        message: message
    })
};
exports.post_driver_create=async(req,res)=>{
    try {
        const userId=req.session.userID;
        const driverImg=req.file ? req.file.filename:"defaultDriver.jpg";
        const fullname=req.body.fullname;
        const phone=req.body.phone;
        const email=req.body.email;
        const gender=req.body.gender=="-1" ? null: req.body.gender;
        const url=slugfield(fullname);

        const driver=await Driver.create({
            driverImg: driverImg,
            fullname: fullname,
            phone: phone,
            email: email,
            gender: gender,
            url: url,
            userId: userId
        });

        driver.driverCode=await randomCodeGenerator("DRV", driver);
        await driver.save();


        req.session.message={text:`${fullname} adlı soför eklendi`, class:"success"};
        return res.redirect("/firm/drivers");

    } catch (err) {
        console.log(err);
        let message="";
        if(err.name=="SequelizeValidationError"){
            for (const e of err.errors) {
                    message += `${e.message} <br>`;
            }
        }
        else if(err.name=="SequelizeUniqueConstraintError"){
            req.session.message={text:"Telefon Numarası ya da E-Posta zaten sistemde mevcut", class:"warning"};
        }
        else{
            logger.error(err.message);
            return res.render("errors/500",{title: "500"});
        }

        req.session.message={text: message, class:"warning"};
        return res.redirect("/firm/driver/create");
    }
};
exports.get_driver_edit=async(req,res)=>{
    const driverId=req.params.id;
    const userId=req.session.userID;
    const message=req.session.message;
    delete req.session.message;
    const driver=await Driver.findOne({where:{[Op.and]:[{userId: userId},{id: driverId}]},attributes:["driverImg", "fullname", "phone", "id", "email", "gender"]});
    return res.render("admin/driver-pages/driver-edit",{
        title: "Şoför Güncelle",
        driver: driver,
        message: message
    });
};
exports.post_driver_edit=async(req,res)=>{
    const driverId=req.body.driverId;
    const slug=req.params.slug;
    const userId=req.session.userID;
    try {
        let driverImg=req.body.driverImg;
        const fullname=req.body.fullname;
        const phone=req.body.phone;
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

        const driver=await Driver.findOne({where:{[Op.and]:[{userId: userId},{id: driverId}]}});
        driver.driverImg=driverImg;
        driver.fullname=fullname;
        driver.phone=phone;
        driver.email=email;
        driver.gender=gender;
        driver.url=slugfield(fullname);
        await driver.save();

        req.session.message={text:`${fullname} adlı şoför bilgileri güncellendi`, class:"success"};
        return res.redirect("/firm/drivers");

    } catch (err) {
        let message="";
        if(err.name=="SequelizeValidationError"){
            for (const e of err.errors) {
                    message += `${e.message} <br>`;
            }
        }
        else if(err.name=="SequelizeUniqueConstraintError"){
            message == "Telefon Numarası ya da E-Posta zaten sistemde mevcut"
        }
        else{
            logger.error(err.message);
            return res.render("errors/500",{title: "500"});
        }

        req.session.message={text: message, class:"warning"};
        return res.redirect(`/firm/driver/edit/${driverId}/${slug}`);
    }
};
exports.post_driver_delete=async(req,res)=>{
    const driverId=req.body.driverId;
    const driverImg=req.body.driverImg;
    const userId=req.session.userID;


    if(driverImg!="defaultDriver.jpg"){
        fs.unlink("/public/images/"+driverImg,err=>{
            fs.unlink("./public/images/"+req.body.driverImg,err=>{
                if(err){
                    logger.error(`Şoför silindi ancak resmi silinemedi. Silinemeyen resim: ${driverImg},${err}`);
                }
            })
        })
    }

    const driver=await Driver.destroy({where:{[Op.and]:[{userId: userId},{id:driverId}]}});
    if(driver){
        req.session.message={text:"Soför silindi", class:"danger"};
    }else{
        req.session.message={text:"Soför silinemedi", class:"danger"};

    }
    return res.redirect("/firm/drivers");
};
exports.get_drivers=async(req,res)=>{
    const message=req.session.message;
    delete req.session.message;
    const userId=req.session.userID;
    const drivers=await Driver.findAll({where:{userId: userId},include:{model:Vehicle, attributes:["plate"]},order: [['createdAt', 'DESC']]});
    return res.render("admin/driver-pages/drivers",{
        title: "Şöförler",
        message: message,
        drivers: drivers
    });
};

