const adminRoutes=require("../routes/adminRouter");
const userRoutes=require("../routes/userRouter");
const notfound=require("../middlewares/404");
const error=require("../middlewares/error");

module.exports=function(app){
    app.use("/admin",adminRoutes);
    app.use(userRoutes);
    app.use("*", notfound);
    app.use(error);
}

