module.exports=async function(req,res){
    return res.status(404).render("errors/404",{title:"404 Not Found"});
}