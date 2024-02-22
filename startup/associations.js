const { Cargo, CargoType, District, Driver, Province, Role, Route, User, VehicleType, Vehicle, userRole, VehicleDriver, CustomerAdvert, Voyage, ShipperAdvert, Offer }=require("../models/index-models");

module.exports=function(){

    //vehicle and vehicle type relation (one to many)
    VehicleType.hasMany(Vehicle);
    Vehicle.belongsTo(VehicleType);

    //driver and vehicle relation (many to many)
    Vehicle.belongsToMany(Driver, {through: VehicleDriver});
    Driver.belongsToMany(Vehicle, {through:VehicleDriver});

    //province and district relation (one to many)
    Province.hasMany(District);
    District.belongsTo(Province)

    //route and district relation (one to many)
    Route.belongsTo(District, { foreignKey: 'startDistrict' });
    Route.belongsTo(District, { foreignKey: 'endDistrict'});

    //user and role relation (many to many)
    User.belongsToMany(Role, {through: userRole});
    Role.belongsToMany(User, {through: userRole});

    //cargo and cargo type relation (one to many)
    CargoType.hasMany(Cargo);
    Cargo.belongsTo(CargoType);

    //cargo and customer advert relation (one to one)
    Cargo.hasOne(CustomerAdvert);
    CustomerAdvert.belongsTo(Cargo);

    //voyage and route relation (one to one)
    Route.hasOne(Voyage);
    Voyage.belongsTo(Route);

    //voyage and vehicle-driver relation (one to many)
    Vehicle.hasMany(Voyage);
    Voyage.belongsTo(Vehicle);

    //voyage and shipper advert relation (one to one)
    Voyage.hasOne(ShipperAdvert);
    ShipperAdvert.belongsTo(Voyage);

    //relation with user table and other tables (for specific access)
    User.hasMany(Cargo);
    Cargo.belongsTo(User);

    //customerAdvert and user relation (one to many)
    User.hasMany(CustomerAdvert);
    CustomerAdvert.belongsTo(User);

    //user and route relation (one to many)
    User.hasMany(Route);
    Route.belongsTo(User);

    //user and voyage relation (one to many)
    User.hasMany(Voyage);
    Voyage.belongsTo(User);

    //user and vehicle relation (one to many)
    User.hasMany(Vehicle);
    Vehicle.belongsTo(User);

    //user and driver relation (one to many)
    User.hasMany(Driver);
    Driver.belongsTo(User);

    //user and shipperAdvert relation (one to many)
    User.hasMany(ShipperAdvert);
    ShipperAdvert.belongsTo(User);

    CustomerAdvert.hasMany(Offer);
    Offer.belongsTo(CustomerAdvert);

    ShipperAdvert.hasMany(Offer);
    Offer.belongsTo(ShipperAdvert);

    Offer.belongsTo(User, { foreignKey: 'offeredBy' });
    Offer.belongsTo(User, { foreignKey: 'recivedBy'});


};