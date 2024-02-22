const logger = require("../startup/logger");
const slugfield= require("../helpers/slugfield");
const bcrypt=require("../helpers/bcrypt");
const randomCodeGenerator = require("../helpers/randomCodeGenerator");

const { Cargo, CargoType, District, Driver, Province, Role, Route, VehicleType, Vehicle, User, CustomerAdvert }=require("../models/index-models");




async function dummyData(){
    //created provinces and district
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

    //created Role and User
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
                {fullname:"Admin Profili", email:"admin@tasitasit.com", phone:"11111111111", password: await bcrypt.hash("123456"),termsAndConditions: true, isActive: true},
                {fullname:"Firma Profili", email:"firm@tasitasit.com", phone:"22222222222", password: await bcrypt.hash("123456"),termsAndConditions: true, isActive: true},
                {fullname:"Nakliyeci Profili", email:"shipper@tasitasit.com", phone:"33333333333", password: await bcrypt.hash("123456"),termsAndConditions: true, isActive: true},
                {fullname:"Müşteri Profili", email:"customer@tasitasit.com", phone:"44444444444", password: await bcrypt.hash("123456"),termsAndConditions: true, isActive: true},
            ]);
            for (const user of users) {
                user.userCode=await randomCodeGenerator("USR", user);
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
            await users[2].addRole(roles[1]);
            await users[2].addRole(roles[2]);

            await users[3].addRole(roles[1]); //for customer

            logger.info("Created association between users and roles");

            //created cargo-types, cargos and customer adverts
            const cargoType_count=await CargoType.count();
            if(cargoType_count==0){
                const cargoTypes=await CargoType.bulkCreate([
                    {cargoTypeName: "dökme mal", url:slugfield("dökme mal")},
                    {cargoTypeName: "koli", url:slugfield("koli")},
                    {cargoTypeName: "çuval", url:slugfield("çuval")},
                ]);
        
                for (const cargoType of cargoTypes) {
                    cargoType.cargoTypeCode=await randomCodeGenerator("CRTYP",cargoType);
                    await cargoType.save();
                };
        
                logger.info("Kargo Türleri Başarıyla Eklendi");
        
                const cargos=await Cargo.bulkCreate([
                    {cargoName: "İhraç Fazlası Tekstil", cargoImg:"defaultCargo.jpg", description: `<a href="#">Tekstilcim</a>'e acilen teslim edilmesi gereken <b>150kg</b> <em>ihraç fazlası tekstil ürünleri</em> mevcuttur. Hızlı bir şekilde teslim edebilecek nakliyeci arkadaşların tekliflerini bekliyorum`, weight: 950, verticalHeight: 175, horizontalHeight: 84.6, cargoTypeId: cargoTypes[0].id, userId: users[0].id},
                    {cargoName: "Akrilik Boya", cargoImg:"defaultCargo.jpg", description: `<a href="#">Nil Tuhafiye</a>'ye acilen teslim edilmesi gereken <b>120 koli</b> <em><a href="#">Rich</a> firmasına ait akrilik boya</em> mevcuttur. Hızlı bir şekilde teslim edebilecek nakliyeci arkadaşların tekliflerini bekliyorum`, weight: 1000, verticalHeight: 375, horizontalHeight: 120, cargoTypeId: cargoTypes[1].id, userId: users[2].id},
                    {cargoName: "Tavuk Yemi", cargoImg:"cuval.webp", description: `<a href="#">Anadolu Yem</a>'e acilen teslim edilmesi gereken <b>5 çuval</b> <em>tavuk yemi</em> mevcuttur. Hızlı bir şekilde teslim edebilecek nakliyeci arkadaşların tekliflerini bekliyorum`, weight: 450, verticalHeight: 875, horizontalHeight: 54.6, cargoTypeId: cargoTypes[2].id, userId: users[3].id},
                ]);
                for (const cargo of cargos) {
                    cargo.cargoCode=await randomCodeGenerator("CRG",cargo);
                    await cargo.save();
                };
        
                logger.info("Kargolar Başarıyla Eklendi");
        
        
                const customerAdverts=await CustomerAdvert.bulkCreate([
                    {title: "Denizli'ye Teslim, Tekstil Ürünü", startPoint: 16, startDistrict: 1832, endPoint: 20, endDistrict: 1832, description: `<a href="#">Tekstilcim</a>'e (bir Denizli Tekstil Firması) teslim edilmesi gerekiyor.`, startDate: "2024-02-22", endDate:"2024-02-25", cargoId: cargos[0].id, userId: users[0].id},
                    {title: "Malatya'ya Teslim", startPoint: 34, startDistrict: 1823, endPoint: 44, endDistrict: 1729, description: `<a href="#">Nil Tuhafiye</a>'ye <b>(Malatya'da Hobi/Sanatsal Malzemler Firması)</b> teslim edilmesi gereken <em>kolili</em> ürünler mevcut.`, startDate: "2024-01-16", endDate:"2024-01-24", cargoId: cargos[1].id, userId: users[2].id},
                    {title: "Anadolu Yem (Kayseri)", startPoint: 23, startDistrict: 1566, endPoint: 36,  endDistrict: 1846, description: `<a href="#">Anadolu Yem</a>'e (Kayseri firması) teslim edilmesi gerekiyor.`, startDate: "2024-01-16", endDate:"2024-02-16", cargoId: cargos[2].id, userId: users[3].id},
        
                ]);
        
                for (const customerAdvert of customerAdverts) {
                    customerAdvert.advertCode=await randomCodeGenerator("ADVCST", customerAdvert);
                    await customerAdvert.save();
                }
        
                logger.info("Müşteri İlanları Başarıyla Eklendi");
        
        
            };    

            //created vehicle-types, vehicles and drivers
            const vehicleType_count=await VehicleType.count();
            if(vehicleType_count==0){
                const vehicleTypes=await VehicleType.bulkCreate([
                    {vehicleTypeName: "doblo", url: slugfield("doblo")},
                    {vehicleTypeName: "kamyonet", url: slugfield("kamyonet")},
                    {vehicleTypeName: "binek", url: slugfield("binek")},
                ]);
        
                for (const vehicleType of vehicleTypes) {
                    vehicleType.vehicleTypeCode=await randomCodeGenerator("VHCTY", vehicleType);
                    await vehicleType.save();
                }
        
                logger.info("Araç Türleri başarıyla eklendi");
                //create vehicle
                const vehicleCount=await Vehicle.count();
                if(vehicleCount==0){
                    const vehicles=await Vehicle.bulkCreate([
                        { vehicleImg: 'doblo-maxi-2016.jpg', plate: '06 ADJ 436', brand: 'Fiat doblo', capacity: 120, wheels: 4, url: slugfield("06 ADJ 436"), vehicleTypeId: vehicleTypes[0].id, userId: users[0].id },
                        { vehicleImg: 'defaultVehicle.jpg', plate: '35 DEF 456', brand: 'BMC', capacity: 796.5, wheels: 4, url: slugfield("35 DEF 456"),  vehicleTypeId: vehicleTypes[1].id, userId: users[1].id},
                        { vehicleImg: 'polo-2016.webp', plate: '44 KN 238', brand: 'Volkswagen Polo', capacity: 5, wheels: 4, url: slugfield("44 KN 238"), vehicleTypeId: vehicleTypes[2].id, userId: users[2].id }
                    ])
        
                    for (const vehicle of vehicles) {
                        vehicle.vehicleCode=await randomCodeGenerator("VHC", vehicle);
                        await vehicle.save();
                    };
        
                    logger.info("Araçlar başarıyla eklendi"); 
                    //create driver
                    const driverCount=await Driver.count();
                    if(driverCount==0){
                        const drivers=await Driver.bulkCreate([
                            {driverImg: "driver-1.jpeg", fullname: "Yasin Acar", phone:"5244596379", email: "yasinaacar@outlook.com", gender: 1, url:slugfield("Yasin Acar"), userId: users[0].id},
                            {driverImg: "driver-2.png", fullname: "Mertali Tosun", phone:"5227725695", email: "mertali3621@gmail.com", gender: 1, url:slugfield("Mertali Tosun"), userId: users[1].id},
                            {driverImg: "defaultDriver.jpg", fullname: "Şefik Merpez", phone:"5323365376", email: "merpezsefik@outlook.com", gender: 0, url:slugfield("Şefik Merpez"), userId: users[1].id},
                        ]);
                        for (const driver of drivers) {
                            driver.driverCode=await randomCodeGenerator("DRV", driver);
                            await driver.save();
                        };
            
                        logger.info("Sürücüler başarıyla eklendi");
                        //create asscociation between driver and vehicles
                        await drivers[0].addVehicle(vehicles[0]);
                        await drivers[0].addVehicle(vehicles[2]);
                        await drivers[1].addVehicle(vehicles[0]);
                        await drivers[1].addVehicle(vehicles[1]);
                        await drivers[2].addVehicle(vehicles[1]);
        
                        logger.info("Sürücülere ilgili arçlar başarıyla atandı");
                    }
                };
        
        
        
            };
        };
    };


    // const routeCount=await Route.count();
    // if(routeCount==0){
    //     const routes=await Route.bulkCreate([
    //         {startPoint: 34, startDistrict: 1166, endPoint: 23, endDistrict: 1173, visitPoints:{"":"16", "":"06","": "71","": "50", "":"44"}},
    //         // {startPoint: 1823, endPoint: 1729, visitPoints:["14", "06", "71", "40", "50", "38"]},
    //         // {startPoint: 1566, endPoint: 1846, visitPoints:["23", "44", "58"]},
    //     ]);

    //     for (const route of routes) {
    //         route.routeCode=await randomCodeGenerator("ROT", route);
    //         await route.save();
    //     }

    //     logger.info("Rotalar başarıyla eklendi");
    // };
    
}



module.exports=dummyData;