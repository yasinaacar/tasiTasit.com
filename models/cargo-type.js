const {DataTypes}=require("sequelize");
const {sequelize} = require("../startup/db");

const CargoType=sequelize.define("cargoType", {
    cargoTypeCode:{
        type: DataTypes.STRING,
        unique: true
    },
    cargoTypeName:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    url:{
        type: DataTypes.STRING
    }
},{timestamps: false});


module.exports= CargoType;