const {createLogger, format, transports} = require("winston");
const { combine, timestamp, prettyPrint} = format;

const logger=createLogger({
    level: "debug",
    format: combine(
        timestamp({format: "DD-MM-YYYY  HH:mm:ss"}),
        prettyPrint()
    ),
    transports:[
        new transports.Console(),
        new transports.File({filename: "logs/logs.log", level:"error"})
    ]
})

module.exports= logger;

