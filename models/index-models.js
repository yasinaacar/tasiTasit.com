const Cargo=require("../models/cargo");
const CargoType=require("./cargo-type");
const District=require("../models/district");
const Driver=require("../models/driver");
const Province=require("../models/province");
const Role=require("../models/role");
const Route=require("../models/route");
const User=require("../models/user");
const VehicleType=require("../models/vehicle-type");
const Vehicle=require("../models/vehicle");
const userRole=require("../models/userRole");
const VehicleDriver=require("../models/vehicleDriver");
const CustomerAdvert=require("../models/customer-advert");
const ShipperAdvert=require("../models/shipper-advert");
const Voyage=require("../models/voyage");
const Offer=require("../models/offer");

module.exports={ Cargo, CargoType, District, Driver, Province, Role, Route, User, VehicleType, Vehicle, userRole, VehicleDriver, CustomerAdvert, Voyage, ShipperAdvert,Offer };