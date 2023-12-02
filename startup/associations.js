const VehicleType=require("../models/vehicle-type");
const Vehicle=require("../models/vehicle");
const Driver=require("../models/driver");
const vehicleDriver=require("../models/vehicleDriver");
const District=require("../models/district");
const Province=require("../models/province");
const Route=require("../models/route");



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

    Route.belongsTo(District, { foreignKey: 'startPoint' });
    Route.belongsTo(District, { foreignKey: 'endPoint'});

}