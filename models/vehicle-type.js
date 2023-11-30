const {DataTypes}=require("sequelize");
const {sequelize} = require("../startup/db");

const VehicleType=sequelize.define("vehicleType", {
    vehicleTypeName:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate:{
            len:[5,10]
        }

    },
    vehicleTypeCode:{
        type: DataTypes.STRING
    },
    url:{
        type: DataTypes.STRING
    }
});


module.exports= VehicleType;

