const {DataTypes}=require("sequelize");
const {sequelize} = require("../startup/db");

const ShipperAdvert=sequelize.define("shipperAdvert", {
    advertCode:{
        type: DataTypes.STRING,
        unique: true
    },
    title:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notNull: {
                msg: `<b>İlan Başlığı</b> boş geçilemez`
            },
            notEmpty:{
                msg: `<b>İlan Başlığı</b> boş geçilemez`
            },
            len:{
                args: [5,50],
                msg: `<b>İlan Başlığı</b> en az 5 en fazla 50 karakter içermelidir`
                
            }
        }
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

