const express = require('express');
const router = express.Router()
const ProductController = require('../controllers/ProductController.js')

router.post('/create-product', ProductController.createProduct)
router.get('/get-all-product', ProductController.getAllProduct)
router.get('/get-product/:id', ProductController.getProduct)
router.put('/update-product/:id', ProductController.updateProduct)
router.delete('/delete-product/:id', ProductController.deleteProduct)

module.exports = router