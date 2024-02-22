const express=require("express");
const router=express.Router();

const userController=require("../controllers/userController");
const {isAuth}=require("../middlewares/isAccess");


router.get("/", userController.get_homepage);
router.get("/adverts/:advertType",userController.get_adverts);
router.post("/adverts/:advertType/:startPoint-:endPoint/:startDate", userController.post_filter_adverts);
router.get("/:advertType/offer/create/:advertCode", isAuth,userController.get_create_offer);
router.post("/:advertType/offer/create/:advertCode", isAuth, userController.post_create_offer);
router.post("/offer/delete/:offerCode", isAuth, userController.post_delete_offer);
router.get("/offers", isAuth,userController.get_offers);


module.exports=router;