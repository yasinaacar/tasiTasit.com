const {DataTypes}=require("sequelize");
const {sequelize} = require("../startup/db");

const Vehicle=sequelize.define("vehicle", {
    vehicleCode:{
        type: DataTypes.STRING,
        unique: true
    },
    vehicleImg:{
        type: DataTypes.STRING,
        defaultValue: "defaultvehicle.jpg"
    },
    plate:{
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate:{
            notNull: {
                msg: "Plaka boş geçilemez"
            },
            notEmpty: {
                msg: "Plaka boş geçilemez"
            }
        }
    },
    brand:{
        type: DataTypes.STRING,
    },
    capacity:{
        type: DataTypes.FLOAT,
        defaultValue: 0,
        validate:{
            isNumeric:{
                msg: `<b>Kapasite</b> sadece sayısal bir değer olabilir, harf veya özel karakter içeremez`
            },
            min:{
                args: -1,
                msg: `Kapasite</b> değeri 0 ya da 0 dan büyük olmalıdır`
            },
            isNumeric:{
                msg: "Kapasite yalnızca rakakam içermelidir"
            }
        }
    },
    wheels:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notNull: {
                msg: "Teker Sayısı boş geçilemez"
            },
            notEmpty: {
                msg: "Teker Sayısı boş geçilemez"
            },
            isInt:{
                msg: "Teker Sayısı bir tam sayı olmalıdır"
            },
            isNumeric:{
                msg: "Teker Sayısı yalnızca rakakam içermelidir"
            }
        }
    },
    url:{
        type: DataTypes.STRING,
    }
});


module.exports= Vehicle;

