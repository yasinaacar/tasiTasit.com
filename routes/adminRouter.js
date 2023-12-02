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

//voyage url
router.get("/voyage/create", adminController.get_voyage_create);
router.post("/voyage/create", adminController.post_voyage_create);
router.get("/voyage/edit/:id", adminController.get_voyage_edit);
router.post("/voyage/edit/:id", adminController.post_voyage_edit);
router.get("/voyages", adminController.get_voyages);

//route url
router.get("/route/create", adminController.get_route_create);
router.post("/route/create", adminController.post_route_create);
router.get("/route/edit/:id", adminController.get_route_edit);
router.post("/route/edit/:id", adminController.post_route_edit);
router.get("/routes", adminController.get_routes);

//cargo url
router.get("/cargo/create", adminController.get_cargo_create);
router.post("/cargo/create", adminController.post_cargo_create);
router.get("/cargo/edit/:id", adminController.get_cargo_edit);
router.post("/cargo/edit/:id", adminController.post_cargo_edit);
router.get("/cargos", adminController.get_cargos);

//shipper_advert url
router.get("/shipper-advert/create", adminController.get_shipper_advert_create);
router.post("/shipper-advert/create", adminController.post_shipper_advert_create);
router.get("/shipper-advert/edit/:id", adminController.get_shipper_advert_edit);
router.post("/shipper-advert/edit/:id", adminController.post_shipper_advert_edit);
router.get("/shipper-adverts", adminController.get_shipper_adverts);

//customer_advert url
router.get("/customer-advert/create", adminController.get_customer_advert_create);
router.post("/customer-advert/create", adminController.post_customer_advert_create);
router.get("/customer-advert/edit/:id", adminController.get_customer_advert_edit);
router.post("/customer-advert/edit/:id", adminController.post_customer_advert_edit);
router.get("/customer-adverts", adminController.get_customer_adverts);

//route url
router.get("/route/create", adminController.get_route_create);
router.post("/route/create", adminController.post_route_create);
router.get("/route/edit/:id", adminController.get_route_edit);
router.post("/route/edit/:id", adminController.post_route_edit);
router.get("/routes", adminController.get_routes);


//offer url
router.get("/offer/create", adminController.get_offer_create);
router.post("/offer/create", adminController.post_offer_create);
router.get("/offer/edit/:id", adminController.get_offer_edit);
router.post("/offer/edit/:id", adminController.post_offer_edit);
router.get("/offers", adminController.get_offers);



module.exports=router;