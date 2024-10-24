const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/products');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append file extension
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: fileFilter
});

module.exports = upload;


const Product = require('../models/product');
const Category = require('../models/category');

exports.createProduct = async (req, res) => {
    try {
        const { name, category, price } = req.body;
        const images = req.files.map(file => file.filename);

        const newProduct = new Product({ name, category, price, images });
        await newProduct.save();

        res.redirect('/products');
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category').exec();
        res.render('products/index', { products });
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.editProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        const categories = await Category.find();
        res.render('products/edit', { product, categories });
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { name, category, price } = req.body;
        const images = req.files.map(file => file.filename);

        await Product.findByIdAndUpdate(req.params.id, { name, category, price, images });
        res.redirect('/products');
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndRemove(req.params.id);
        res.redirect('/products');
    } catch (err) {
        res.status(500).send(err);
    }
};
