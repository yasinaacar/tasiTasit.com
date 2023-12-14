const {DataTypes}=require("sequelize");
const {sequelize} = require("../startup/db");

const userRole=sequelize.define("userRole", {
    userRoleId:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    }
},{timestamps: false});


module.exports= userRole;

