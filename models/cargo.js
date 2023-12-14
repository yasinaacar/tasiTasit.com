const {DataTypes}=require("sequelize");
const {sequelize} = require("../startup/db");

const Cargo=sequelize.define("cargo", {
    cargoImg:{
        type: DataTypes.STRING,
    },
    cargoWeight:{
        type: DataTypes.INTEGER
    },
    cargoHeight:{
        type: DataTypes.INTEGER,
    },
    cargoDetail:{
        type: DataTypes.STRING,
    },
    cargoCode:{
        type: DataTypes.STRING,
    },
    url:{
        type: DataTypes.STRING
    }
});


module.exports= Cargo;

