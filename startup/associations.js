const { Cargo, CargoType, District, Driver, Province, Role, Route, User, VehicleType, Vehicle, userRole, vehicleDriver }=require("../models/index-models");




module.exports=function(){

    //vehicle and vehicle type relation (one to many)
    VehicleType.hasMany(Vehicle);
    Vehicle.belongsTo(VehicleType);

    //driver and vehicle relation (many to many)
    Vehicle.belongsToMany(Driver, {through: vehicleDriver});
    Driver.belongsToMany(Vehicle, {through:vehicleDriver});

    //province and district relation (one to many)
    Province.hasMany(District);
    District.belongsTo(Province)

    //route and district relation (one to many)
    Route.belongsTo(District, { foreignKey: 'startPoint' });
    Route.belongsTo(District, { foreignKey: 'endPoint'});

    //user and role relation (many to many)
    User.belongsToMany(Role, {through: userRole});
    Role.belongsToMany(User, {through: userRole});

}