const {DataTypes}=require("sequelize");
const {sequelize} = require("../startup/db");
const District=require("./district");

const Route = sequelize.define('route', {
    startPoint: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: District,
        key: 'id'
      }
    },
    endPoint: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: District,
        key: 'id'
      }
    }
  });

  module.exports=Route;