const {DataTypes}=require("sequelize");
const {sequelize} = require("../startup/db");

const vehicleDriver=sequelize.define("vehicleDriver", {
    vehicleDriverId:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    }
},{timestamps: false});


module.exports= vehicleDriver;

