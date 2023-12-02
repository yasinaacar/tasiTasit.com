const {DataTypes}=require("sequelize");
const {sequelize} = require("../startup/db");

const Driver=sequelize.define("driver", {
    driverImg:{
        type: DataTypes.STRING,
    },
    driverCode:{
        type: DataTypes.STRING
    },
    fullname:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty:{
                msg:"Full Name can't be empty"
            },
            isFullname(value){
                if(value.split(" ").length<2){
                    throw new Error("Please enter your name and surname. And be sure leave of space between")
                }
            }
        }
    },
    telephone:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email:{
        type: DataTypes.STRING,
        unique:true,
        validate:{
            isEmail:{
                msg:"E-Posta kısmının e-posta formatında olduğundan emin olun."
            }
        }
    },
    gender:{
        type: DataTypes.BOOLEAN,
    },
    url:{
        type: DataTypes.STRING
    }
});


module.exports= Driver;

