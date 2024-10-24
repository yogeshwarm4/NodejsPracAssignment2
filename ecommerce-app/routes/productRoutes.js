const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../controllers/multerConfig');

router.get('/', productController.getProducts);
router.get('/create', (req, res) => res.render('products/create'));
router.post('/', upload.array('images', 5), productController.createProduct); // Upload up to 5 images
router.get('/:id/edit', productController.editProduct);
router.post('/:id', upload.array('images', 5), productController.updateProduct);
router.post('/:id/delete', productController.deleteProduct);

module.exports = router;
