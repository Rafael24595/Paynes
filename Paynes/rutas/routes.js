const express = require('express');
const router = express.Router();

const controller = require('../controladores/product');

router.get("/generateDatabase", controller.generateDatabase);
router.get("/getCategory", controller.getCategory);
router.get("/getCategoriesIcon", controller.getCategoriesIcon)
router.get("/getGallery", controller.getGallery);
router.get("/getOffer", controller.getOffer);
router.post("/saleProceed", controller.saleProceed);

module.exports = router;
