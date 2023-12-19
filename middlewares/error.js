const logger=require("../startup/logger");

module.exports=async function(err,req, res, next){
    logger.error(err.message);    
    return res.status(500).render("errors/500",{title:"500"})
}