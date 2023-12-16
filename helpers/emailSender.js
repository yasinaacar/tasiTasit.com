const nodemailer = require("nodemailer");
const config=require("config");

const email=config.get("email.from");
const password=config.get("email.password");
const host=config.get("emailOptions.host");
const port=config.get("emailOptions.port");
const secure=config.get("emailOptions.secure");
const ciphers=config.get("emailOptions.ciphers");


const transporter= nodemailer.createTransport({
    //this settings are for outlook, u can design by your project
    host: host,
    port: port,
    secure: secure,
    tls:{
        ciphers: ciphers
    },
    auth:{
        user: email,
        pass: password
    }
});

module.exports=transporter;