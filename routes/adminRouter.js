const express=require("express");
const router=express.Router();
const imageUpload=require("../helpers/imageUpload");
const adminController=require("../controllers/adminController");
const isAuth=require("../middlewares/isAuth");
const {isAdmin,isFirm, isShipper}=require("../middlewares/isAccess");


//vehicle type url
router.post("/vehicle-type/create", isAuth, isAdmin,adminController.post_vehicleType_create);
router.get("/vehicle-type/edit/:slug", isAuth, isAdmin, adminController.get_vehicleType_edit);
router.post("/vehicle-type/edit/:slug", isAuth, isAdmin, adminController.post_vehicleType_edit);
router.post("/vehicle-type/vehicle/remove/:slug", isAuth, isAdmin, adminController.post_remove_vehicle_from_vehicleType);
router.post("/vehicle-type/delete/:id", isAuth, isAdmin, adminController.post_vehicleType_delete);
router.get("/vehicle-types", isAuth, isAdmin,adminController.get_vehicleTypes);

//vehicle url
router.get("/vehicle/create", isAuth,  isShipper, adminController.get_vehicle_create);
router.post("/vehicle/create", isAuth,  isShipper, imageUpload.upload.single("vehicleImg"),adminController.post_vehicle_create);
router.get("/vehicle/edit/:vehicleId", isAuth,  isShipper, adminController.get_vehicle_edit);
router.post("/vehicle/edit/:vehicleId", isAuth,  isShipper, imageUpload.upload.single("vehicleImg"),adminController.post_vehicle_edit);
router.post("/vehicle/delete/:vehicleId", isAuth, isShipper, adminController.post_vehicle_delete);
router.get("/vehicles", isAuth, isShipper, adminController.get_vehicles);

//driver url
router.get("/driver/create", isAuth, isFirm, adminController.get_driver_create);
router.post("/driver/create", isAuth, isFirm,imageUpload.upload.single("driverImg"), adminController.post_driver_create);
router.get("/driver/edit/:id/:slug", isAuth, isFirm, adminController.get_driver_edit);
router.post("/driver/edit/:id/:slug", isAuth, isFirm,imageUpload.upload.single("driverImg"), adminController.post_driver_edit);
router.post("/driver/delete/:id/:slug", isAuth, isFirm, adminController.post_driver_delete);
router.get("/drivers", isAuth, isFirm, adminController.get_drivers);

//route url
router.get("/route/create", isAuth, isShipper, adminController.get_route_create);
router.post("/route/create", isAuth, isShipper, adminController.post_route_create);
router.get("/routes", isAuth, isShipper, adminController.get_routes);

//cargo type url
router.post("/cargo-type/create", isAuth, isAdmin, adminController.post_cargoType_create);
router.post("/cargo-type/edit/:id", isAuth, isAdmin, adminController.post_cargoType_edit);
router.post("/cargo-type/delete/:id", isAuth, isAdmin, adminController.post_cargoType_delete);
router.get("/cargo-types", isAuth, isAdmin, adminController.get_cargoTypes);

//role url
router.post("/role/create", isAuth, isAdmin, adminController.post_role_create);
router.get("/role/edit/:slug", isAuth, isAdmin, adminController.get_role_edit);
router.post("/role/edit/:slug", isAuth, isAdmin,adminController.post_role_edit);
router.post("/role/:slug/remove-user/:id", isAuth, isAdmin, adminController.post_remove_user_from_role);
router.post("/role/delete/:id", isAuth, isAdmin, adminController.post_role_delete);
router.get("/roles", isAuth, isAdmin, adminController.get_roles);

//user url
router.post("/user/edit/:id", isAuth, isAdmin, adminController.post_user_edit);
router.post("/user/block/:id", isAuth, isAdmin, adminController.post_user_block);
router.post("/user/remove-block/:id", isAuth,  isAdmin,adminController.post_user_remove_block);
router.get("/users", isAuth, isAdmin, adminController.get_users);


module.exports=router;