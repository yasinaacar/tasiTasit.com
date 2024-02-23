const {DataTypes}=require("sequelize");
const {sequelize} = require("../startup/db");

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
          msg: "Başlangıç Şehri Boş Geçilemez !!!"
        },
        notNull:{
          msg: "Başlangıç Şehri Boş Geçilemez !!!"
        },
      }
    },
    startDistrict: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate:{
        notEmpty:{
          msg: "Başlangıç İlçesi Boş Geçilemez !!!"
        },
        notNull:{
          msg: "Başlangıç İlçesi Boş Geçilemez !!!"
        },
      }
    },
    endPoint: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate:{
        notEmpty:{
          msg: "Bitiş Şehri Boş Geçilemez !!!"
        },
        notNull:{
          msg: "Bitiş Şehri Boş Geçilemez !!!"
        },
      }
    },
    endDistrict: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate:{
        notEmpty:{
          msg: "Bitiş İlçesi Boş Geçilemez !!!"
        },
        notNull:{
          msg: "Bitiş İlçesi Boş Geçilemez !!!"
        },
      }
    },
    visitPoints: {
      type: DataTypes.JSON,
      defaultValue: null
    }
  });

  module.exports=Route;