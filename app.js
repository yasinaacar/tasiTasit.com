//catch error
require("express-async-errors");

//modules
const express=require("express");
const path=require("path");
const {sequelize}=require("./startup/db");
const cookieParser=require("cookie-parser");
require("express-session");
const session = require("express-session");
const SequelizeStore=require("connect-session-sequelize")(session.Store);



const app=express();

//middlewares
app.set("view engine", "ejs");
require("./startup/logger");
app.use(express.urlencoded({extended:true }))
app.use(cookieParser());
app.use(session({
    secret: "keybord cat",
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 1000*60*60*12
    },
    store:new SequelizeStore({
        db: sequelize
    })
}));
app.use(express.urlencoded({extended: true}));
app.use(require("./middlewares/locals"));


app.use("/libs", express.static(path.join(__dirname,"node_modules")));
app.use("/static", express.static(path.join(__dirname, "public")));

//routes
require("./startup/routes")(app);

//associations
require("./startup/associations")();

//connect database
(async()=>{
    // await sequelize.sync({alter: true});
    // await require("./data/dummy-data")();
})();



const port= process.env.PORT;

app.listen(port, ()=>{
    console.log(`listening port ${port}...`)
})