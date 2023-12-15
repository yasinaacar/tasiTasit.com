const express=require("express");
const router=express.Router();
const imageUpload=require("../helpers/imageUpload");
const adminController=require("../controllers/adminController");
const isAuth=require("../middlewares/isAuth");

//vehicle type url
router.post("/vehicle-type/create", isAuth, adminController.post_vehicleType_create);
router.get("/vehicle-type/edit/:slug", isAuth, adminController.get_vehicleType_edit);
router.post("/vehicle-type/edit/:slug", isAuth, adminController.post_vehicleType_edit);
router.post("/vehicle-type/vehicle/remove/:slug", isAuth, adminController.post_remove_vehicle_from_vehicleType);
router.post("/vehicle-type/delete/:id", isAuth, adminController.post_vehicleType_delete);
router.get("/vehicle-types", isAuth, adminController.get_vehicleTypes);

//vehicle url
router.get("/vehicle/create", isAuth, adminController.get_vehicle_create);
router.post("/vehicle/create", isAuth, imageUpload.upload.single("vehicleImg"),adminController.post_vehicle_create);
router.get("/vehicle/edit/:vehicleId", isAuth, adminController.get_vehicle_edit);
router.post("/vehicle/edit/:vehicleId", isAuth, imageUpload.upload.single("vehicleImg"),adminController.post_vehicle_edit);
router.post("/vehicle/delete/:vehicleId", isAuth, adminController.post_vehicle_delete);
router.get("/vehicles", isAuth, adminController.get_vehicles);

//driver url
router.get("/driver/create", isAuth, adminController.get_driver_create);
router.post("/driver/create", isAuth,imageUpload.upload.single("driverImg"), adminController.post_driver_create);
router.get("/driver/edit/:id/:slug", isAuth, adminController.get_driver_edit);
router.post("/driver/edit/:id/:slug", isAuth,imageUpload.upload.single("driverImg"), adminController.post_driver_edit);
router.post("/driver/delete/:id/:slug", isAuth, adminController.post_driver_delete);
router.get("/drivers", isAuth, adminController.get_drivers);

//route url
router.get("/route/create", isAuth, adminController.get_route_create);
router.post("/route/create", isAuth, adminController.post_route_create);
router.get("/routes", isAuth, adminController.get_routes);

//cargo type url
router.post("/cargo-type/create", isAuth, adminController.post_cargoType_create);
router.post("/cargo-type/edit/:id", isAuth, adminController.post_cargoType_edit);
router.post("/cargo-type/delete/:id", isAuth, adminController.post_cargoType_delete);
router.get("/cargo-types", isAuth, adminController.get_cargoTypes);

//role url
router.post("/role/create", isAuth, adminController.post_role_create);
router.get("/role/edit/:slug", isAuth, adminController.get_role_edit);
router.post("/role/edit/:slug", isAuth, adminController.post_role_edit);
router.post("/role/:slug/remove-user/:id", isAuth, adminController.post_remove_user_from_role);
router.post("/role/delete/:id", isAuth, adminController.post_role_delete);
router.get("/roles", isAuth, adminController.get_roles);

//user url
router.post("/user/edit/:id", isAuth, adminController.post_user_edit);
router.post("/user/block/:id", isAuth, adminController.post_user_block);
router.post("/user/remove-block/:id", isAuth, adminController.post_user_remove_block);
router.get("/users", isAuth, adminController.get_users);


module.exports=router;