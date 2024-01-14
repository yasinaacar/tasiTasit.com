const { Cargo, CargoType, District, Driver, Province, Role, Route, User, VehicleType, Vehicle, userRole, VehicleDriver, CustomerAdvert, Voyage }=require("../models/index-models");

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
    Route.belongsTo(District, { foreignKey: 'startPoint' });
    Route.belongsTo(District, { foreignKey: 'endPoint'});

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
}