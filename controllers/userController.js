exports.get_homepage=async(req,res)=>{
    return res.render("user/homepage",{
        title: "Ana Sayfa"
    })
}