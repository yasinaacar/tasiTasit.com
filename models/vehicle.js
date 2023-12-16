const {DataTypes}=require("sequelize");
const {sequelize} = require("../startup/db");

const Vehicle=sequelize.define("vehicle", {
    vehicleImg:{
        type: DataTypes.STRING,
    },
    vehicleCode:{
        type: DataTypes.STRING
    },
    plate:{
        type: DataTypes.STRING,
        unique: true,
    },
    brand:{
        type: DataTypes.STRING,
    },
    capacity:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    wheels:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    url:{
        type: DataTypes.STRING
    }
});


module.exports= Vehicle;

