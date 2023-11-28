const {Sequelize}=require("sequelize");
const config=require("config");
const logger=require("./logger");

const database=config.get("db.database");
const username=config.get("db.username");
const host=config.get("db.host");
const password=config.get("db.password");

const sequelize=new Sequelize(database, username, password, {
    host: host,
    dialect: "mysql",
    storage: "./session.mysql"
});

//connect database

async function connectMysql(){
    try {
        await sequelize.authenticate();
        logger.info("Connection has been established succesfully");
    } catch (err) {
        logger.error("Unable to connect to the database!!!",err);
    }
}

connectMysql();


module.exports={ sequelize };
