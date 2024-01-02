const {DataTypes}=require("sequelize");
const {sequelize} = require("../startup/db");

const VehicleDriver=sequelize.define("vehicleDriver", {
    vehicleDriverId:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    }
},{timestamps: false});


module.exports= VehicleDriver;

