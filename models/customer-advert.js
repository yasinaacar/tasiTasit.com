const {DataTypes}=require("sequelize");
const {sequelize} = require("../startup/db");

const CustomerAdvert=sequelize.define("customerAdvert", {
    advertCode:{
        type: DataTypes.STRING,
        unique: true
    },
    title:{
        type: DataTypes.STRING
    },
    startPoint:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notNull:{
                msg:"Başlangıç Noktası boş geçilemez"
            },
            notEmpty:{
                msg:"Başlangıç Noktası boş geçilemez"
            },
            isInt:{
                msg:"Başlangıç Noktası için sadece sunulan seçeneklerden birini seçin"
            }
        }
    }, 
    endPoint:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notNull:{
                msg:"Bitiş noktası boş geçilemez"
            },
            notEmpty:{
                msg:"Bitiş noktası boş geçilemez"
            },
            isInt:{
                msg:"Bitiş noktası için sadece sunulan seçeneklerden birini seçin"
            }
        }
    },
    description:{
        type: DataTypes.TEXT,
        len:{
            args: [0,500],
            msg: `<b>Kargo Açıklaması</b> maksimum 500 karakter içermelidir`
        }
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

