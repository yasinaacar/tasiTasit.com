const {DataTypes}=require("sequelize");
const {sequelize} = require("../startup/db");

const Driver=sequelize.define("driver", {
    driverCode:{
        type: DataTypes.STRING,
        unique: true
    },
    driverImg:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "defaultDriver.jpg"
    },
    fullname:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty:{
                msg:"Ad Soyad boş geçilemez"
            },
            notNull:{
                msg: "Ad Soyad boş geçilemez"
            },
            isFullname(value){
                if(value.split(" ").length<2){
                    throw new Error("Ad ve Soyad arasında bir boşluk bırakın");
                }
            }
        }
    },
    phone:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            isNumeric:{
                msg: `<b>Telefon Numarası</b> sadece sayı içermelidir`
            },
            notNull:{
                msg: `<b>Telefon Numarası</b> boş geçilemez`
            },
            notEmpty:{
                msg: `<b>Telefon Numarası</b> boş geçilemez`
            },
        }
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique:{
            msg: "Bu E-Posta adresine kayıtlı bir şoför zaten var"
        },
        validate:{
            isEmail:{
                msg:"E-Posta kısmının e-posta formatında olduğundan emin olun."
            } ,
            notNull:{
                msg: "E-mail alanı boş geçilemez"
            },
            notEmpty:{
                msg: "E-mail alanı boş geçilemez"
            }
        }
    },
    gender:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    url:{
        type: DataTypes.STRING
    }
});


module.exports= Driver;

