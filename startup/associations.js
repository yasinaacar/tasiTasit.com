const VehicleType=require("../models/vehicle-type");
const Vehicle=require("../models/vehicle");

module.exports=function(){

    //vehicle and vehicle type relation
    VehicleType.hasMany(Vehicle);
    Vehicle.belongsTo(VehicleType)
}