const {DataTypes}=require("sequelize");
const {sequelize} = require("../startup/db");
const District=require("./district");

const Route = sequelize.define('route', {
    routeCode:{
      type: DataTypes.STRING,
      unique: true
    },
    startPoint: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate:{
        notEmpty:{
          msg: "Başlangıç Noktası Boş Geçilemez !!!"
        },
        notNull:{
          msg: "Başlangıç Noktası Boş Geçilemez !!!"
        },
      }
    },
    endPoint: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate:{
        notEmpty:{
          msg: "Bitiş Noktası Boş Geçilemez !!!"
        },
        notNull:{
          msg: "Bitiş Noktası Boş Geçilemez !!!"
        },
      }
    },
    visitPoints: {
      type: DataTypes.JSON,
      defaultValue: null
    }
  });

  module.exports=Route;