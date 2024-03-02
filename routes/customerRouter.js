const express=require("express");
const router=express.Router();

const {imageUpload}=require("../helpers/index-helpers");
const {isAuth}=require("../middlewares/isAccess");

const customerController=require("../controllers/customerController");


//advert-csutomer url
router.get("/customer-advert/create/cargo", customerController.get_cargo_create);
router.post("/customer-advert/create/cargo", imageUpload.upload.single("cargoImg"),customerController.post_cargo_create);
router.get("/customer-advert/create/:cargoId", customerController.get_customer_advert_create);
router.post("/customer-advert/create/:cargoId",customerController.post_customer_advert_create);
router.get("/customer-advert/edit/:advertId/cargo/:cargoId", customerController.get_cargo_edit);
router.post("/customer-advert/edit/:advertId/cargo/:cargoId", imageUpload.upload.single("cargoImg"), customerController.post_cargo_edit);
router.get("/customer-advert/edit/:advertId", customerController.get_customer_advert_edit);
router.post("/customer-advert/edit/:advertId", customerController.post_customer_advert_edit);
router.post("/customer-advert/delete/:advertId", customerController.post_customer_advert_delete);
router.get("/customer-adverts", customerController.get_customer_adverts);

//cargo url
router.get("/cargo/details/:cargoCode", customerController.get_cargo_detail);
router.post("/cargo/delete/:id", customerController.post_cargo_delete);


module.exports=router;