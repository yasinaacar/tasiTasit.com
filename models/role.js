const {DataTypes}=require("sequelize");
const {sequelize} = require("../startup/db");

const Role=sequelize.define("role", {
    roleCode:{
        type: DataTypes.STRING,
    },
    roleName:{
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate:{
            len: [2,20],
            notNull: true,
            isLowercase: true, 
        }
    },
    url:{
        type: DataTypes.STRING,
        unique:true
    }
});


module.exports= Role;

