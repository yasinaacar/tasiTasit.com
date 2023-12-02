const {DataTypes}=require("sequelize");
const {sequelize} = require("../startup/db");

const District=sequelize.define("district", {
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
        unique: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    }
},{timestamps: false});


module.exports= District;

