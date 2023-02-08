const Product = require("../models/Product");
const util = require('util');
const cloudinary = require('cloudinary').v2;
const uploadPromise = util.promisify(cloudinary.uploader.upload);
const fs = require('fs')

exports.addProduct = async (req, res, next) => {
    //มี req.file, req.body ส่งมาให้ใช้
    try {
        // upload image on cloundinary and delete image in floder public\images
        let result;

        if (req.file) {
            result = await uploadPromise(req.file.path)
            fs.unlinkSync(req.file.path);
        }

        const newProduct = new Product({ ...req.body, img: result.secure_url });
        const savedProduct = await newProduct.save();
        res.status(201).json(req.body)
    } catch (err) {
        next(err)
    }
};

exports.updateProduct = async (req, res, next) => {
    //มี req.file, req.body ส่งมาให้ใช้
    //มี req.user จาก verifyTokenAndAdmin ส่งมาให้ใช้
    try {
        const inventories = await Product.findById(req.params.id)
        let updatedProduct; 
        let updateAmount;
        let result;
        if (req.file) {
            result = await uploadPromise(req.file.path)
            fs.unlinkSync(req.file.path);
        };

        if (req.user.isAdmin) {
            updatedProduct = await Product.findByIdAndUpdate(
                req.params.id,
                {
                    $set: { ...req.body, img: result?.secure_url },
                },
                { new: true }
            );
            res.status(201).json(updatedProduct)

        } else {
            if (req.body.quantity <= inventories.amount) {
                updateAmount = Number(inventories.amount) - Number(req.body.quantity)
                updatedProduct = await Product.findByIdAndUpdate(
                    req.params.id,
                    {
                        amount: updateAmount,
                    },
                    { new: true }
                );
                res.status(201).json(updatedProduct)
            };
        }
        res.status(401).json({ message: "สินค้ามีจำนวนไม่เพียงพอ" })
        // console.log(inventories.amount)
        // res.status(201).json(updatedProduct)
    } catch (err) {
        next(err)
    }
}

exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
        const image = product.img
        const splited = image.split('/');
        const public_id = splited[splited.length - 1].split('.')[0]

        await Product.findByIdAndDelete(req.params.id);
        await cloudinary.uploader.destroy(public_id)

        res.status(200).json({ message: "delete product success." });
    } catch (err) {
        next(err)
    }
};

exports.getProducts = async (req, res, next) => {
    const qCategory = req.query.category;
    const qPage = req.query.page;
    const qSearch = req.query.search;
    const LIMIT = req.query.limit;
    try {
        const startIndex = (Number(qPage) - 1) * LIMIT;
        let total;
        let products;
        if (qCategory) {
            total = await Product.find({
                category: {
                    $in: [qCategory],
                },
            }).count();

            products = await Product.find({
                category: {
                    $in: [qCategory],
                },
            }).sort({ _id: -1 }).limit(LIMIT).skip(startIndex);


        } else if (qSearch) {
            products = await Product.find( 
                {
                    $or: [
                        { name: { $regex: qSearch, } },
                        { secondName: { $regex: qSearch, } },
                        { author: { $regex: qSearch, } },
                        { publishedTranslator: { $regex: qSearch, } },
                        { publisher: { $regex: qSearch, } },
                    ]
                }
            );
            total = products.length
            // res.status(200).json(product);
        } else {
            total = await Product.countDocuments({});
            products = await Product.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
        }
        // res.status(200).json(products);
        res.status(200).json(
            { 
                data: products,
                currentPage: Number(qPage ?? 1),
                numberOfPage: Math.ceil(total / LIMIT),
                totalProduct: total
            });
    } catch (err) {
        next(err)
    }
};
