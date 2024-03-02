const express=require("express");
const router=express.Router();

const userController=require("../controllers/userController");
const {isAuth}=require("../middlewares/isAccess");


router.get("/", userController.get_homepage);
// advert url
router.get("/adverts/:advertType",userController.get_adverts);
router.post("/adverts/:advertType/:startPoint-:endPoint/:startDate", userController.post_filter_adverts);

//offer url
router.get("/:advertType/offer/create/:advertCode", isAuth,userController.get_create_offer);
router.post("/:advertType/offer/create/:advertCode", isAuth, userController.post_create_offer);
router.post("/offer/delete/:offerCode", isAuth, userController.post_delete_offer);
router.get("/offer/detail", isAuth, userController.get_offer_detail);
router.post("/offer/approve/:offerCode", isAuth, userController.post_approve_offer);
router.post("/offer/reject/:offerCode", isAuth, userController.post_reject_offer);
router.get("/offers", isAuth,userController.get_offers);

//acoount url
router.get("/account", isAuth, userController.get_account);
router.get("/account/change-password", isAuth, userController.get_change_password);
router.post("/account/change-password", isAuth, userController.post_change_password);
router.get("/account/edit-contact-informations", isAuth, userController.get_edit_contact_informations);
router.post("/account/edit-contact-informations", isAuth, userController.post_edit_contact_informations);
router.post("/account/freeze-account", isAuth, userController.post_freeze_account);
router.get("/privacy-and-policy", userController.get_privacy_and_policy);




module.exports=router;