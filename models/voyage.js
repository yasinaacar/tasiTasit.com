const {DataTypes}=require("sequelize");
const {sequelize} = require("../startup/db");
const {Vehicle}=require("./index-models");
const Voyage=sequelize.define("voyage", {
    voyageCode:{
        type: DataTypes.STRING,
        unique: true
    },
    startDate:{
        type: DataTypes.DATEONLY,
        defaultValue: Date.now,
        allowNull: false,
        validate:{
            isDate:{
                msg: `<b>Başlangıç Tarihi</b> değeri için bir tarih girin`
            },
            isAfter:{
                args: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
                msg: `<b>Başlangıç Tarihi</b> bugünden önceki tarihlere ayarlanamaz`
            },
            notEmpty:{
                msg:`<b>Başlangıç Tarihi/b>boş geçilemez`
            },
            notNull:{
                msg:`<b>Başlangıç Tarihi/b>boş geçilemez`
            }
        }
    },
    endDate:{
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: () => {
            const today = new Date();
            const oneMonthLater = new Date(today.setMonth(today.getMonth() + 1));
            return oneMonthLater.toISOString().split('T')[0];
        },
        validate:{
            isDate:{
                msg: `<b>Tahmini Teslim Tarihi</b> değeri için bir tarih girin`
            },
            isAfter:{
                args: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
                msg: `<b>Tahmini Teslim Tarihi</b> bugünden önceki tarihlere ayarlanamaz`
            },
            notEmpty:{
                msg:`<b>Başlangıç Tarihi/b>boş geçilemez`
            },
            notNull:{
                msg:`<b>Başlangıç Tarihi/b>boş geçilemez`
            }
        }
    },
    vehicleId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty:{
                msg:`Sefer için bir araç atamak zorundasınız`
            },
            notNull:{
                msg:`Sefer için bir araç atamak zorundasınız`
            } 
        },
        references: {
            model: Vehicle,
            key: 'id' 
        }
    },
    isDeleted:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});


module.exports= Voyage;

