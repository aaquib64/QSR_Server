const express = require("express");
const router = express.Router();

const Controller = require("../Controller/controller");

router.post("/login", Controller.loginEmployee);

router.post("/orders", Controller.orderDetails);

// router.get('/login/:id', Controller.getEmployee);

router.get("/menu", Controller.getMenu);



module.exports = router;
