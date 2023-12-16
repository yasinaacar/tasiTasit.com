const District=require("../models/district");
const Province=require("../models/province");
const User=require("../models/user");
const Role=require("../models/role");
const logger = require("../startup/logger");
const slugfield= require("../helpers/slugfield");
const randomCodeGenerator=require("../public/js/randomcodeGenerator");
const bcrypt=require("../helpers/bcrypt");



async function dummyData(){
    //create provinces and district
    const provinceCount=await Province.count(); 
    if(provinceCount==0){
        const turkeyAPI="https://turkiyeapi.dev/api/v1/provinces";

        fetch(turkeyAPI)
        .then(response=>{
            if(!response.ok){
                logger.error("Turkey API Network response was not OK")
                throw new Error("Turkey API Network response was not ok");
            }
            return response.json();
        })
        .then(async (datas)=>{
            for (const data of datas.data) {
                const province=await Province.create({id:data.id, name:data.name});                
                for (const district of data.districts) {
                    await District.create({id: district.id, name: district.name, provinceId:province.id});
                }
            }
            logger.info("Provinces and districts are added")
        })
        .catch(err=>{logger.error(`FETCH ERROR: ${err}`)});
    }

    //create Role
    const roleCount=await Role.count();
    if (roleCount==0){
        const roles=await Role.bulkCreate([
            {roleName:"admin", url:slugfield("admin")},
            {roleName:"customer", url:slugfield("customer")},
            {roleName:"shipper", url:slugfield("shipper")},
            {roleName:"firm", url:slugfield("firm")},
        ]);
        for (const role of roles) {
            role.roleCode=await randomCodeGenerator("ROL",role);
            await role.save();
        };
        logger.info("Roles are added to database");
        
        //create User
        const userCount=await User.count();
        if(userCount==0){
            const users=await User.bulkCreate([
                {fullname:"Admin Profili", email:"adressforapp@outlook.com", phone:"11111111111", password: await bcrypt.hash("123456"),termsAndConditions: true, isActive: true},
                {fullname:"Firma Profili", email:"firm@tasitasit.com", phone:"22222222222", password: await bcrypt.hash("123456"),termsAndConditions: true, isActive: true},
                {fullname:"Nakliyeci Profili", email:"shipper@tasitasit.com", phone:"33333333333", password: await bcrypt.hash("123456"),termsAndConditions: true, isActive: true},
                {fullname:"Müşteri Profili", email:"customer@tasitasit.com", phone:"44444444444", password: await bcrypt.hash("123456"),termsAndConditions: true, isActive: true},
            ]);
            for (const user of users) {
                user.userCode=await randomCodeGenerator("USR",user);
                await user.save();
            }
            logger.info("Users are added to database");

            //create association between user and roles
            await users[0].addRoles(roles); //for admin

            //for firm
            await users[1].addRole(roles[1]);
            await users[1].addRole(roles[2]);
            await users[1].addRole(roles[3]);

            //for shipper
            await users[2].addRole(roles[2]);
            await users[2].addRole(roles[3]);

            await users[3].addRole(roles[2]); //for customer

            logger.info("Created association between users and roles");
        };
    };

    


}



module.exports=dummyData;