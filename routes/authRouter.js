const express=require("express");
const router=express.Router();

const authController=require("../controllers/authController");

//register routes
router.get("/register/:userType", authController.get_register);
router.post("/register/:userType", authController.post_register);

//activate user / confirm e-mail routes
router.get("/activate-user/:token", authController.get_activate_user);
router.post("/activate-user/:token", authController.post_activate_user);

//login routes
router.get("/login", authController.get_login);
router.post("/login", authController.post_login);

//logout routes
router.get("/logout", authController.post_logout);

//reset password routes
router.get("/reset-password", authController.get_reset_password);
router.post("/reset-password", authController.post_reset_password);
router.get("/new-password/:token", authController.get_new_password);
router.post("/new-password/:token", authController.post_new_password);


module.exports=router;