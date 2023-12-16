const {DataTypes}=require("sequelize");
const {sequelize} = require("../startup/db");

const VehicleType=sequelize.define("vehicleType", {
    vehicleTypeCode:{
        type: DataTypes.STRING
    },
    vehicleTypeName:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate:{
            len: [2,20],
            notNull: true,
            isLowercase: true, 
        }

    },
    url:{
        type: DataTypes.STRING,
        unique: true
    }
});


module.exports= VehicleType;

