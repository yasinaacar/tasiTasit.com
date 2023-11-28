const {DataTypes}=require("sequelize");
const {sequelize} = require("../startup/db");

const VehicleType=sequelize.define("vehicleType", {
    vehicleTypeName:{
        type: DataTypes.STRING,
        allowNull: false
    },
    vehicleTypeCode:{
        type: DataTypes.STRING
    }
});


module.exports= VehicleType;

