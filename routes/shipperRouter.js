const express=require("express");
const router=express.Router();

const {imageUpload}=require("../helpers/index-helpers");
const {isAuth, isShipper}=require("../middlewares/isAccess");

const shipperController=require("../controllers/shipperController");


//vehicle url
router.get("/vehicle/create", isAuth,  isShipper, shipperController.get_vehicle_create);
router.post("/vehicle/create", isAuth,  isShipper, imageUpload.upload.single("vehicleImg"),shipperController.post_vehicle_create);
router.get("/vehicle/edit/:plate", isAuth,  isShipper, shipperController.get_vehicle_edit);
router.post("/vehicle/edit/:plate", isAuth,  isShipper, imageUpload.upload.single("vehicleImg"),shipperController.post_vehicle_edit);
router.post("/vehicle/delete/:vehicleId", isAuth, isShipper, shipperController.post_vehicle_delete);
router.get("/vehicles", isAuth, isShipper, shipperController.get_vehicles);


//route url
router.get("/route/create", isAuth, isShipper, shipperController.get_route_create);
router.post("/route/create", isAuth, isShipper, shipperController.post_route_create);
router.get("/routes", isAuth, isShipper, shipperController.get_routes);




module.exports=router;