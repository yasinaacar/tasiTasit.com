const {DataTypes}=require("sequelize");
const {sequelize} = require("../startup/db");

const User=sequelize.define("user", {
    userCode:{
        type: DataTypes.STRING,
    },
    fullname:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            len: [3,40],
            notNull: true, 
            notEmpty: true,
        }
    },
    email:{
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate:{
            notNull: false,
            notEmpty: true,
            isEmail: true
        }
    },
    phone:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate:{
            notNull: false,
            notEmpty: true
        }
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notNull: false,
            len: [6],
            notEmpty:true
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
        allowNull: false
    },
    isActive:{
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    isBlocked:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
});


module.exports= User;

