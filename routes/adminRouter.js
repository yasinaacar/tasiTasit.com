const express=require("express");
const router=express.Router();

const {imageUpload}=require("../helpers/index-helpers");
const {isAuth ,isAdmin,isFirm, isShipper}=require("../middlewares/isAccess");

const adminController=require("../controllers/adminController");


//vehicle type url
router.post("/vehicle-type/create", isAuth, isAdmin,adminController.post_vehicleType_create);
router.get("/vehicle-type/edit/:slug", isAuth, isAdmin, adminController.get_vehicleType_edit);
router.post("/vehicle-type/edit/:slug", isAuth, isAdmin, adminController.post_vehicleType_edit);
router.post("/vehicle-type/vehicle/remove/:slug", isAuth, isAdmin, adminController.post_remove_vehicle_from_vehicleType);
router.post("/vehicle-type/delete/:id", isAuth, isAdmin, adminController.post_vehicleType_delete);
router.get("/vehicle-types", isAuth, isAdmin,adminController.get_vehicleTypes);


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