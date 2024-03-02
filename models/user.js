const {DataTypes}=require("sequelize");
const {sequelize} = require("../startup/db");

const User=sequelize.define("user", {
    userCode:{
        type: DataTypes.STRING,
        unique: true
    },
    fullname:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            len: {
                args:[3,40],
                msg: "Ad Soyad/Firma Adı minimum 3 maksimum 40 karakter içermelidir"
            },
            notNull:  {
                msg: "Ad Soyad/Firma Adı boş geçilemez"
            },
            notEmpty:  {
                msg: "Ad Soyad/Firma Adı boş geçilemez"
            }
        }
    },
    email:{
        type: DataTypes.STRING,
        unique: {msg: "Bu e-mail adresine kayıtlı bir kullanıcı zaten var"},
        allowNull: false,
        validate:{
            notNull: {
                msg: "E-Mail kısmı boş geçilemez"
            },
            notEmpty:  {
                msg: "E-Mail kısmı boş geçilemez"
            },
            isEmail: {
                msg: "Girdiğiniz E-Mail adresinin 'e-mail' türünde olduğundan emin olun"
            }
        }
    },
    phone:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: {msg: "Bu telefon numarasına kayıtlı bir kullanıcı zaten var"},
        validate:{
            notNull: {
                msg: "Telefon Numarası boş geçilemez"
            },
            notEmpty:  {
                msg: "Telefon Numarası boş geçilemez"
            },
            isNumeric:{
                msg: "Telefon numarası yalnızca sayılardan oluşmalıdır"
            }
        }
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notNull: {
                msg: "Şifre boş geçilemez"
            },
            len: {
                args:[6],
                msg: "Şifre uzunluğu minimum 6 karakter olmalı"
            },
            notEmpty: {
                msg: "Şifre boş geçilemez"
            }
        }
    },
    token:{
        type: DataTypes.STRING
    },
    tokenExpiration:{
        type: DataTypes.DATE
    },
    termsAndConditions:{
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    isActive:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    isBlocked:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isFreezed:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    lastFreezeDate:{
        type: DataTypes.DATE
    }
});


module.exports= User;

