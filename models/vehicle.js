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
        type: DataTypes.STRING
    },
    brand:{
        type: DataTypes.STRING
    },
    capacity:{
        type: DataTypes.INTEGER
    },
    wheels:{
        type: DataTypes.INTEGER
    },
});


module.exports= Vehicle;

