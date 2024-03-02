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

//shipper advert url
router.get("/shipper-advert/create/route/:routeId/voyage/:voyageId/advert",isAuth, isShipper, shipperController.get_shipper_advert_create);
router.post("/shipper-advert/create/route/:routeId/voyage/:voyageId/advert",isAuth, isShipper, shipperController.post_shipper_advert_create);
router.get("/shipper-advert/edit/advertid/:advertId",isAuth, isShipper, shipperController.get_shipper_advert_edit);
router.post("/shipper-advert/edit/advertid/:advertId",isAuth, isShipper, shipperController.post_shipper_advert_edit);
router.post("/shipper-advert/delete/advert/:advertId",isAuth, isShipper, shipperController.post_shipper_advert_delete);
router.get("/shipper-adverts", isAuth, isShipper, shipperController.get_shipper_adverts);


//route url
router.get("/shipper-advert/create/route",isAuth, isShipper, shipperController.get_route_create);
router.post("/shipper-advert/create/route",isAuth, isShipper, shipperController.post_route_create);
router.get("/shipper-advert/edit/advertid/:advertId/routeid/:routeId", isAuth, isShipper, shipperController.get_route_edit);
router.post("/shipper-advert/edit/advertid/:advertId/routeid/:routeId", isAuth, isShipper, shipperController.post_route_edit);
router.post("/route/edit/:routeId", isAuth, isShipper, shipperController.post_route_edit);

//voyage url
router.get("/shipper-advert/create/route/:routeId/voyage",isAuth, isShipper, shipperController.get_voyage_create);
router.post("/shipper-advert/create/route/:routeId/voyage",isAuth, isShipper, shipperController.post_voyage_create);
router.get("/shipper-advert/edit/advertid/:advertId/routeid/:routeId/voyageid/:voyageId", isAuth, isShipper, shipperController.get_voyage_edit);
router.post("/shipper-advert/edit/advertid/:advertId/routeid/:routeId/voyageid/:voyageId", isAuth, isShipper, shipperController.post_voyage_edit);
router.post("/voyage/delete/:voyageId", isAuth, isShipper, shipperController.post_voyage_delete);




module.exports=router;