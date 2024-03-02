const {DataTypes}=require("sequelize");
const {sequelize} = require("../startup/db");

const Offer=sequelize.define("offer", {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    offerCode:{
        type: DataTypes.STRING,
        unique: false
    },
   offeredBy:{
    type: DataTypes.INTEGER,
    allowNull: false,
    validate:{
        notNull:{
            msg:`Teklif veren kullanıcı için ID bilgisini girmek zorundasınız`
        },
        notEmpty:{
            msg:`Teklif veren kullanıcı için ID bilgisini girmek zorundasınız`
        }
    }
   },
   recivedBy:{
    type: DataTypes.INTEGER,
    allowNull: false,
    validate:{
        notNull:{
            msg:`Teklifi alan kullanıcı için ID bilgisini girmek zorundasınız`
        },
        notEmpty:{
            msg:`Teklifi alan kullanıcı için ID bilgisini girmek zorundasınız`
        }
    }
   },
   estimatedDeadline:{
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate:{
        notNull:{
            msg: `Teklif için tahmini bir teslim günü girmek zorundasınız`
        },
        notEmpty:{
            msg: `Teklif için tahmini bir teslim günü girmek zorundasınız`
        },
    }
   },
   estimatedPrice:{
    type: DataTypes.FLOAT,
    defaultValue: 0
   },
   isAccepted:{
    type: DataTypes.BOOLEAN,
   },
   isSeened:{
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
   },
   isActive:{
    type: DataTypes.BOOLEAN,
    defaultValue: true
   }

});


module.exports= Offer;