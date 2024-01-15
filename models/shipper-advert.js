const {DataTypes}=require("sequelize");
const {sequelize} = require("../startup/db");

const ShipperAdvert=sequelize.define("shipperAdvert", {
    advertCode:{
        type: DataTypes.STRING,
        unique: true
    },
    title:{
        type: DataTypes.STRING
    },
    description:{
        type: DataTypes.TEXT,
        len:{
            args: [0,500],
            msg: `<b>İlan Açıklaması</b> maksimum 500 karakter içermelidir`
        }
    },
    isActive:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    isDeleted:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});


module.exports= ShipperAdvert;

