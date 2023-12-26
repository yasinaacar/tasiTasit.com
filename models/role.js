const {DataTypes}=require("sequelize");
const {sequelize} = require("../startup/db");

const Role=sequelize.define("role", {
    roleCode:{
        type: DataTypes.STRING,
        unique: true
    },
    roleName:{
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate:{
            len: {
                args: [2,25],
                msg: "Rol Adı minimum 2 karakter maksimum 25 karakter içermelidir"
            },
            notNull:{
                msg: `Rol Adı boş geçilemez`
            },
            notEmpty:{
                msg: `Rol Adı boş geçilemez`
            },
            isLowercase: {
                msg: "Rol Adını oluştururken sadece küçük harf kullanın"
            }, 
        }
    },
    url:{
        type: DataTypes.STRING,
        unique:true
    }
});


module.exports= Role;

