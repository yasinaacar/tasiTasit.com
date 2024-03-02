const {DataTypes}=require("sequelize");
const {sequelize} = require("../startup/db");

const Cargo=sequelize.define("cargo", {
    cargoCode:{
        type: DataTypes.STRING,
        unique: true
    },
    cargoImg:{
        type: DataTypes.STRING,
        defaultValue: "defaultCargo.jpg"
    },
    weight:{
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
        validate:{
            isNumeric:{
                msg: `<b>Kilo</b> sadece sayısal bir değer olabilir, harf veya özel karakter içeremez`
            },
            min:{
                args: -1,
                msg: `<b>Kilo</b> değeri 0 ya da 0 dan büyük olmalıdır`
            }
        }
    },
    verticalHeight:{
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
        validate:{
            isNumeric:{
                msg: `<b>Uzunluk (yatay)</b> sadece sayısal bir değer olabilir, harf veya özel karakter içeremez`
            },
            min:{
                args: -1,
                msg: `<b>Uzunluk (yatay)</b> değeri 0 ya da 0 dan büyük olmalıdır`
            }
        }
    }, 
    horizontalHeight:{
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
        validate:{
            isNumeric:{
                msg: `<b>Uzunluk (dikey)</b> sadece sayısal bir değer olabilir, harf veya özel karakter içeremez`
            },
            min:{
                args: -1,
                msg: `<b>Uzunluk (dikey)</b> değeri 0 ya da 0 dan büyük olmalıdır`
            }
        }

    },
    isDeleted:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});


module.exports= Cargo;

