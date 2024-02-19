const express=require("express");
const router=express.Router();

const userController=require("../controllers/userController");

router.get("/", userController.get_homepage);
router.get("/adverts/:advertType",userController.get_adverts);
router.post("/adverts/:advertType",userController.post_adverts);
router.post("/adverts/:advertType/:startPoint-:endPoint/:startDate", userController.post_filter_adverts);


module.exports=router;