const express=require("express");
const router=express.Router();

const {imageUpload}=require("../helpers/index-helpers");
const {isAuth ,isFirm}=require("../middlewares/isAccess");

const firmController=require("../controllers/firmController");

//driver url
router.get("/driver/create", isAuth, isFirm, firmController.get_driver_create);
router.post("/driver/create", isAuth, isFirm,imageUpload.upload.single("driverImg"), firmController.post_driver_create);
router.get("/driver/edit/:id/:slug", isAuth, isFirm, firmController.get_driver_edit);
router.post("/driver/edit/:id/:slug", isAuth, isFirm,imageUpload.upload.single("driverImg"), firmController.post_driver_edit);
router.post("/driver/delete/:id", isAuth, isFirm, firmController.post_driver_delete);
router.get("/drivers", isAuth, isFirm, firmController.get_drivers);


module.exports=router;