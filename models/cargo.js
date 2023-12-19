const {DataTypes}=require("sequelize");
const {sequelize} = require("../startup/db");

const Cargo=sequelize.define("cargo", {
    cargoImg:{
        type: DataTypes.STRING,
    },
    cargoName:{
        type: DataTypes.STRING
    },
    weight:{
        type: DataTypes.INTEGER,
        validate:{
            isNumeric: true,
        }
    },
    verticalHeight:{
        type: DataTypes.INTEGER,
    }, 
    horizontalHeight:{
        type: DataTypes.INTEGER,
    },
    description:{
        type: DataTypes.TEXT,
    },
    cargoCode:{
        type: DataTypes.STRING,
    },
    isDeleted:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});


module.exports= Cargo;

