const {DataTypes}=require("sequelize");
const {sequelize} = require("../startup/db");

const CustomerAdvert=sequelize.define("customerAdvert", {
    advertCode:{
        type: DataTypes.STRING,
    },
    title:{
        type: DataTypes.STRING
    },
    startPoint:{
        type: DataTypes.INTEGER,
    }, 
    endPoint:{
        type: DataTypes.INTEGER,
    },
    description:{
        type: DataTypes.TEXT,
    },
    startDate:{
        type: DataTypes.DATEONLY
    },
    endDate:{
        type: DataTypes.DATEONLY
    },
    isActive:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    isDeleted:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});


module.exports= CustomerAdvert;

