const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../Middlewares/auth");

const Controller = require("../Controller/controller");

router.post("/login", Controller.loginEmployee);

router.post("/orders", Controller.orderDetails);

router.get("/menu", Controller.getMenu);

router.get( "/admin/orders", verifyToken,  requireRole("manager", "supervisor"), Controller.getAllOrders) 

// router.get('/login/:id', Controller.getEmployee);

module.exports = router;
