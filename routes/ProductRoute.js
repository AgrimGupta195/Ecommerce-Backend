const express= require('express');
const { createProduct, getaProduct, getAllProduct } = require('../controllers/productController');
const router = express.Router();

router.post('/',createProduct);
router.get('/',getAllProduct);
router.get('/:id',getaProduct);




module.exports = router;