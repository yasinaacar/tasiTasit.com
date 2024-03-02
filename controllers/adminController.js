//models
const { Cargo, CargoType, District, Driver, Province, Role, Route, User, VehicleType, Vehicle, CustomerAdvert }=require("../models/index-models");

//helpers
const {transporter, slugfield, randomCodeGenerator}=require("../helpers/index-helpers");

const logger = require("../startup/logger");
const fs=require("fs");
const { Op, where } = require("sequelize");
const config  = require("config");


//vehicle Types process
exports.post_vehicleType_create=async(req,res)=>{
    const vehicleTypeName=req.body.vehicleTypeName;
    try {
        const vehicleType=await VehicleType.create({vehicleTypeName: vehicleTypeName.toLowerCase()});
        vehicleType.url=slugfield(vehicleTypeName);
        const generatedCode=await randomCodeGenerator("VHCTY", vehicleType);
        vehicleType.vehicleTypeCode=generatedCode;
        await vehicleType.save();
        req.session.message={text:`<b>"${vehicleType.vehicleTypeName}"</b> adlı araç türü eklendi`, class:"success"}
        return res.redirect("/admin/vehicle-types?action=create");
        
    } catch (err) {
        let message= "";
        if(err.name=="SequelizeUniqueConstraintError"){
            req.session.message={text:`<b>"${vehicleTypeName}"</b> adında araç türü zaten kayıtlı`, class:"warning"};
        }
        else if(err.name="SequelizeValidationError"){
            for (const e of err.errors) {
                message += `${e.message} <br>`;
            }
            req.session.message={text:message, class:"warning"}
        }
        else{
            logger.error(err.message);
            return res.render("errors/500",{title: "500"});
        }
        return res.redirect("/admin/vehicle-types");


    }
    
};
exports.get_vehicleType_edit=async(req,res)=>{
    const message=req.session.message;
    delete req.session.message;
    const slug=req.params.slug;
    const vehicleType=await VehicleType.findOne({where:{url: slug}});
    const vehicleTypeId=vehicleType.id
    const vehicles=await Vehicle.findAll({where:{vehicleTypeId: vehicleTypeId}});
    return res.render("admin/vehicle-pages/vehicle-type-edit",{
        title: "Araç Türü Düzenle",
        vehicleType: vehicleType,
        vehicles: vehicles,
        message: message
    })
};
exports.post_vehicleType_edit=async(req,res)=>{
    const vehicleTypeId=req.body.vehicleTypeId;
    const vehicleTypeName=req.body.vehicleTypeName;
    const url=req.params.slug;

    const vehicleType=await VehicleType.findByPk(vehicleTypeId);
    try {        
        vehicleType.vehicleTypeName=vehicleTypeName.toLowerCase();
        vehicleType.url=slugfield(vehicleTypeName);
        await vehicleType.save();
        req.session.message={text:`${vehicleType.vehicleTypeCode} kodlu araç türü güncellendi`, class:"primary"};
        return res.redirect("/admin/vehicle-types?action=edit");
    } catch (err) {
        let message= "";
        if(err.name=="SequelizeUniqueConstraintError"){
            req.session.message={text:`<b>"${vehicleTypeName}"</b> adında araç türü zaten kayıtlı`, class:"warning"};
        }
        else if(err.name="SequelizeValidationError"){
            for (const e of err.errors) {
                message += `${e.message} <br>`;
            }
            req.session.message={text:message, class:"warning"}
        }
        else{
            logger.error(err.message);
            return res.render("errors/500",{title: "500"});
        }
        return res.redirect("/admin/vehicle-types");


    }

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
    const vehicleTypes=await VehicleType.findAll({include:{model: Vehicle},order: [['createdAt', 'DESC']]});
    const message=req.session.message;
    delete req.session.message;
    return res.render("admin/vehicle-pages/vehicle-types",{
        title: "Araç Türleri",
        message: message,
        vehicleTypes: vehicleTypes,
    });
};

//cargo type process
exports.post_cargoType_create=async(req,res)=>{
    const cargoTypeName=req.body.cargoTypeName;
    try {
        const cargoType=await CargoType.create({cargoTypeName: cargoTypeName.toLowerCase()});

        cargoType.cargoTypeCode=await randomCodeGenerator("CRTYP",(cargoType));
        cargoType.url=slugfield(cargoTypeName);
        await cargoType.save();

        req.session.message={text:`<b>"${cargoTypeName.toLowerCase()}"</b> adlı kargo türü başarıyla eklendi`, class:"success"};
        return res.redirect("/admin/cargo-types?action=create");

    } catch (err) {
        console.log(err);
        let message= "";
        if(err.name=="SequelizeValidationError"){
            for (const e of err.errors) {
                message += `${e.message} <br>`;
                console.log(message)
            }
            req.session.message={text: message, class:"warning"};
            return res.redirect("/admin/cargo-types");
        }

        else if(err.name=="SequelizeUniqueConstraintError"){
            req.session.message={text:`${cargoTypeName} adlı kargo türü zaten sistemde mevcut`, class:"warning"}
            return res.redirect("/admin/cargo-types");
        }
        else{
            logger.error(err.message);
            return res.render("errors/500",{title: "500"});
        }
        
    }
};
exports.post_cargoType_edit=async(req,res)=>{
    const cargoTypeName=req.body.cargoTypeName;
    const cargoTypeId=req.body.cargoTypeId;
    try {
        const cargoType=await CargoType.findByPk(cargoTypeId);
        cargoType.cargoTypeName=cargoTypeName;
        cargoType.url=slugfield(cargoTypeName);
        await cargoType.save();

        req.session.message={text:`<b>"${cargoTypeName}"</b> adlı kargo türü başarıyla güncellendi`, class:"primary"};
        return res.redirect("/admin/cargo-types?action=edit");

    } catch (err) {
        let message="";
        if(err.name=="SequelizeValidationError"){
            for (const e of err.errors) {
                message += `${e.message} <br>`
            }
         req.session.message={text:message, class:"warning"};

        }
        else if(err.name=="SequelizeUniqueConstraintError"){
            req.session.message={text:`<b>"${cargoTypeName.toLowerCase()}"</b> adlı kargo türü zaten sistemde mevcut`, class:"danger"}
        }
        else{
            logger.error(err.message);
            return res.render("errors/500",{title: "500"});
        }
        return res.redirect("/admin/cargo-types");

    }
};
exports.post_cargoType_delete=async(req,res)=>{
    const cargoTypeId=req.body.cargoTypeId;
    const cargoTypeName=req.body.cargoTypeName;
    await CargoType.destroy({where:{id:cargoTypeId}});
    req.session.message={text:`<b>"${cargoTypeName}"</b> adlı kargo türü silindi`, class:"danger"};
    return res.redirect("/admin/cargo-types?action=delete");
};  
exports.get_cargoTypes=async(req,res)=>{
    const message=req.session.message;
    delete req.session.message;
    const cargoTypes=await CargoType.findAll({include:{model:Cargo}});
    return res.render("admin/cargo-pages/cargo-types",{
        title: "Kargo Türleri",
        cargoTypes: cargoTypes,
        message: message
    })
};

//role process
exports.post_role_create=async(req,res)=>{
    const roleName=req.body.roleName;
    try {
        const role=await Role.create({roleName:roleName.toLowerCase(), url:slugfield(roleName)});
        role.roleCode=await randomCodeGenerator("ROL",role);
        await role.save();
        req.session.message={text:`${role.roleName} adlı rol başarıyla eklendi`, class:"success"};
        return res.redirect("/admin/roles");
    } catch (err) {
        console.log(err);
        let message="";
        if(err.name=="SequelizeValidationError"){
            for (const e of err.errors) {
                message += `${e.message} <br>`
            }
         req.session.message={text:message, class:"warning"};

        }
        else if(err.name=="SequelizeUniqueConstraintError"){
            req.session.message={text:`<b>${roleName.toLowerCase()}</b> adlı rol zaten var`, class:"warning"};
        }
        else{
            logger.error(err.message);
            return res.render("errors/500",{title: "500"});
        }
        return res.redirect("/admin/roles");
    }
};
exports.get_role_edit=async(req,res)=>{
    const message=req.session.message;
    delete req.session.message;
    const slug=req.params.slug;
    const role=await Role.findOne({where:{url:slug},include:{model:User}});
    return res.render("admin/role-pages/role-edit",{
        title: "Rol Güncelle",
        role: role,
        message: message
    })
};
exports.post_role_edit=async(req,res)=>{
    const roleName=req.body.roleName;
    const slug=req.params.slug;

    try {
        const roleId=req.body.roleId;
        const role=await Role.findByPk(roleId);
        if(role.url=="admin" || role.url=="customer"){
            req.session.message={text:`<b>"${role.roleName}"</b> adlı rol silinemez ya da güncellenemez`, class:"danger"}
            return res.redirect("/admin/role/edit/"+slug);
        }
        role.roleName=roleName.toLowerCase();
        role.url=slugfield(roleName);
        await role.save();
        req.session.message={text:`<b>"${roleName}"</b> adlı rol güncellendi`, class:"primary"};
        return res.redirect("/admin/roles");
        
    } catch (err) {
        console.log(err)
        let message = "";
        if(err.name=="SequelizeValidationError"){
            for (const e of err.errors) {
                message += `${e.message} <br>`
            }
            req.session.message={text: message, class:"warning"};
        }
        else if(err.name=="SequelizeUniqueConstraintError"){
            req.session.message={text:`<b>"${roleName}"</b> adlı rol zaten var`, class:"danger"};
        }
        else{
            logger.error(err.message);
            return res.render("errors/500",{title: "500"});
        }

        return res.redirect("/admin/role/edit/"+slug);
    }
};
exports.post_remove_user_from_role=async(req,res)=>{
    const userId=req.body.userId;
    const roleId=req.body.roleId;
    const slug=req.params.slug;

    const role=await Role.findByPk(roleId,{include:{model:User}});
    await role.removeUser(userId);
    
    return res.redirect("/admin/role/edit/"+slug);
}
exports.post_role_delete=async(req,res)=>{
    try {
        const roleId=req.body.roleId;
        const roleName=req.body.roleName;
        const role=await Role.findByPk(roleId);
        if(role.url=="admin" || role.url=="customer"){
            req.session.message={text:`<b>"${roleName}"</b> adlı rol silinemez ya da güncellenemez`, class:"danger"}
            return res.redirect("/admin/roles");
        }
        await role.destroy();
        req.session.message={text:`"${roleName}" adlı rol silindi`, class:"danger"};
        return res.redirect("/admin/roles?action=delete");
    } catch (err) {
        logger.error(err.message);
        req.session.message={text: "Bilinmeyen bir hata oluştu, şu anda bu silme işlemini gerçekleştiremiyoruz. Lütfen daha sonra tekrar deneyin", class:"danger"}
        return res.redirect("/admin/roles");
    }
};
exports.get_roles=async(req,res)=>{
    const message=req.session.message;
    delete req.session.message;
    const roles=await Role.findAll({include:{model:User}});
    return res.render("admin/role-pages/roles",{
        title:"Roller",
        roles: roles,
        message: message
    })
    
};

//user process
exports.post_user_edit=async(req,res)=>{
    const userId=req.body.userId;
    const roleIds=req.body.roleIds;
    const user=await User.findByPk(userId,{include:{model:Role}});
    if(roleIds==undefined){
        await user.removeRoles(user.roles); 
    };

    await user.removeRoles(user.roles);
    await user.addRoles(roleIds);

    req.session.message={text:`${user.fullname} adlı kullanıcı başarıyla güncellendi`, class:"success"};
    return res.redirect("/admin/users");
};
exports.post_user_block=async(req,res)=>{
    try {
        const userId=req.body.userId;
        const user=await User.findByPk(userId,{attributes:["id","isBlocked","fullname", "email"]});
        user.isBlocked=true;
        await user.save(); 
        const sendedMail=await transporter.sendMail({
            from: config.get("email.from"),
            to: user.email,
            subject: "Hesabın Engellendi || tasitasit.com",
            html:`
                <h1>Hesabın Engellendi</h1>
                <h5>Sevgili ${user.fullname}</h5>
                <p>tasitasit.com sitesindeki hesabınız topluluk kurallarını ihlal ettiği için engellendi. Bir Hata olduğunu düşünüyorsan bize ulaş</p><br>
                <a href="mailto:${config.get("email.from")}">Bize Mail At</a>
            `
        });

        if(sendedMail){
            logger.info(`Hesabı engellenen kullanıcıya mail gönderildi. DETAY: ${sendedMail.messageId}`)
        }
        req.session.message={text:`${user.fullname} adlı kullanıcı engellendi`, class:"warning"};
        return res.redirect("/admin/users");
    } catch (err) {
        console.log(err)
    }
};
exports.post_user_remove_block=async(req,res)=>{
    try {
        const userId=req.body.userId;
        const user=await User.findByPk(userId,{attributes:["id","isBlocked","fullname", "email"]});
        user.isBlocked=false;
        await user.save(); 
        const sendedMail=await transporter.sendMail({
            from: config.get("email.from"),
            to: user.email,
            subject: "Hesabın Tekrar Açıldı || tasitasit.com",
            html:`
                <h1>Hesabın Tekrar Açıldı :)</h1>
                <h5>Sevgili ${user.fullname}</h5>
                <p>tasitasit.com sitesindeki hesabınızı ve işlemlerinizi tekrar gözden geçirdik, yaptığımız incelemeler sonucunda hesabını tekrar aktif ettik. Aramıza tekrar hoş geldin...</p><br>
            `
        });

        if(sendedMail){
            logger.info(`Hesabı aktifleştirilen kullanıcıya mail gönderildi. DETAY: ${sendedMail.messageId}`)
        }
        req.session.message={text:`${user.fullname} adlı kullanıcının engeli kaldırıldı`, class:"warning"};
        return res.redirect("/admin/users");
    } catch (err) {
        console.log(err)
    }
};
exports.get_users=async(req,res)=>{
    const message=req.session.message;
    delete req.session.message;

    const users=await User.findAll({include:{model: Role},order: [['createdAt', 'DESC']]});
    const roles=await Role.findAll({attributes:["id", "roleName"]});
    return res.render("admin/users",{
        title:"Kullanıcı Listesi",
        message: message,
        users: users,
        roles: roles
    })
};
