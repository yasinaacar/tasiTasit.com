const express=require("express");
const router=express.Router();
const imageUpload=require("../helpers/imageUpload");
const adminController=require("../controllers/adminController");

//vehicle type url
router.post("/vehicle-type/create", adminController.post_vehicleType_create);
router.get("/vehicle-type/edit/:slug", adminController.get_vehicleType_edit);
router.post("/vehicle-type/edit/:slug", adminController.post_vehicleType_edit);
router.post("/vehicle-type/vehicle/remove/:slug", adminController.post_remove_vehicle_from_vehicleType);
router.post("/vehicle-type/delete/:id", adminController.post_vehicleType_delete);
router.get("/vehicle-types", adminController.get_vehicleTypes);

//vehicle url
router.get("/vehicle/create", adminController.get_vehicle_create);
router.post("/vehicle/create", imageUpload.upload.single("vehicleImg"),adminController.post_vehicle_create);
router.get("/vehicle/edit/:vehicleId", adminController.get_vehicle_edit);
router.post("/vehicle/edit/:vehicleId", imageUpload.upload.single("vehicleImg"),adminController.post_vehicle_edit);
router.post("/vehicle/delete/:vehicleId", adminController.post_vehicle_delete);
router.get("/vehicles", adminController.get_vehicles);

//driver url
router.get("/driver/create", adminController.get_driver_create);
router.post("/driver/create",imageUpload.upload.single("driverImg"), adminController.post_driver_create);
router.get("/driver/edit/:id/:slug", adminController.get_driver_edit);
router.post("/driver/edit/:id/:slug",imageUpload.upload.single("driverImg"), adminController.post_driver_edit);
router.post("/driver/delete/:id/:slug", adminController.post_driver_delete);
router.get("/drivers", adminController.get_drivers);

//route url
router.get("/route/create", adminController.get_route_create);
router.post("/route/create", adminController.post_route_create);
router.get("/routes", adminController.get_routes);

//cargo type url
router.post("/cargo-type/create", adminController.post_cargoType_create);
router.post("/cargo-type/edit/:id", adminController.post_cargoType_edit);
router.post("/cargo-type/delete/:id", adminController.post_cargoType_delete);
router.get("/cargo-types", adminController.get_cargoTypes);

//role url
router.post("/role/create", adminController.post_role_create);
router.get("/role/edit/:slug", adminController.get_role_edit);
router.post("/role/edit/:slug", adminController.post_role_edit);
router.post("/role/delete/:id", adminController.post_role_delete);
router.get("/roles", adminController.get_roles);




module.exports=router;