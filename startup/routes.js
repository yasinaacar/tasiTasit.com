const adminRoutes=require("../routes/adminRouter");
const shipperRoutes=require("../routes/shipperRouter");
const firmRoutes=require("../routes/firmRouter");
const customerRoutes=require("../routes/customerRouter");
const userRoutes=require("../routes/userRouter");
const authRoutes=require("../routes/authRouter");
const notfound=require("../middlewares/404");
const error=require("../middlewares/error");
module.exports=function(app){
    app.use(`/admin`,adminRoutes);
    app.use(`/shipper`,shipperRoutes);
    app.use(`/firm`,firmRoutes);
    app.use(`/customer`,customerRoutes);
    app.use("/auth",authRoutes);
    app.use(userRoutes);
    app.use("*", notfound);
    app.use(error);
}

