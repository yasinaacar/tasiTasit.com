const {DataTypes}=require("sequelize");
const {sequelize} = require("../startup/db");

const Province=sequelize.define("province", {
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
        unique: true,
        validate:{
            notNull: true,
            notEmpty: true,
        }
    }
},{timestamps: false});


module.exports= Province;

