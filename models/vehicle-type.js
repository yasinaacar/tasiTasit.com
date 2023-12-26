const {DataTypes}=require("sequelize");
const {sequelize} = require("../startup/db");

const VehicleType=sequelize.define("vehicleType", {
    vehicleTypeCode:{
        type: DataTypes.STRING,
        unique: true
    },
    vehicleTypeName:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate:{
            len: {
                args:[2,20],
                msg: "Araç Türü adı minimum 2 maksimum 20 karakter içermelidir"
            },
            notNull: {
                msg: "Araç Türü adı boş geçilemez"
            },
            notEmpty: {
                msg: "Araç Türü adı boş geçilemez"
            },
            isLowercase: {
                msg: "Araç türü adı küçük harflerden oluşmalıdır"
            }, 
        }

    },
    url:{
        type: DataTypes.STRING,
        unique: true
    }
});


module.exports= VehicleType;

