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
        unique: true,
        validate:{
            isLowercase:{
                msg: `Kargo türü adı sadece <b>küçük harf</b> içermelidir`
            },
            notNull:{
                msg: "Kargo Türü adı boş geçilemez"
            },
            notEmpty:{
                msg: "Kargo Türü adı boş geçilemez"
            },
            len:{
                args: [3,25],
                msg: "Kargo Türü adı mininmum 3 maksimum 25 karakter içermelidir"
            }
        }
    },
    url:{
        type: DataTypes.STRING,
        unique: true
    }
},{timestamps: false});


module.exports= CargoType;