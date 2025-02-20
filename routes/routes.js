const express = require('express');
const router = express.Router();
const controller = require("../controller/controller");
const authMiddleware = require("../middleware/middleware");

router.post('/api/register',controller.register);
router.post('/api/login',controller.login);

router.post('/example', authMiddleware, controller.example);


module.exports = router; 