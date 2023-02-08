//มีแค่ admin เท่านั้นที่สามารถ เพิ่ม ลบ แก้ไข product ได้
const upload = require('../middlewere/upload')
const Product = require("../models/Product");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewere/verifyToken");
const productController = require("../controller/productController")
const router = require("express").Router();

//CREATE
router.post("/", verifyTokenAndAdmin, upload.single('file'), productController.addProduct);

//UPDATE id product
router.put("/:id", verifyToken, upload.single('file'),productController.updateProduct)

//DELETE
router.delete("/:id", verifyTokenAndAdmin, productController.deleteProduct)


//GET PRODUCT for everone
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// // router.get("/:category", async (req, res) => {
// //   try {
// //     const product = await Product.find(
// //       {
// //         category: {
// //           $in: [req.params.category],
// //         },
// //       }
// //     );
// //     res.status(200).json(product);
// //   } catch (err) {
// //     res.status(500).json(err);
// //   }
// // });

// //GET ALL PRODUCTS for everone
// router.get("/", async (req, res) => {
//   const qPage = req.query.page;
//   const qSearch = req.query.search;
//   const qNew = req.query.new;
//   const qCategory = req.query.category;
//   const LIMIT = req.query.limit
//   try {
//     let products;
//     // const LIMIT = 12;
//     const startIndex = (Number(qPage) - 1) * LIMIT;
//     let total = await Product.countDocuments({});

//     if (qNew) {
//       products = await Product.find().sort({ createdAt: -1 }).limit(1);
//     } else if (qCategory) {
//       products = await Product.find({
//         category: {
//           $in: [qCategory],
//         },
//       })
//       // products = await productsTarget.limit(LIMIT).skip(startIndex);
//       // total = await productsTarget.length
//     } else if (qSearch) {
//       products = await Product.find({
//         $or: [
//           { engName: { $regex: qSearch, } },
//           { thaiName: { $regex: qSearch, } },
//           { author: { $regex: qSearch, } },
//           { publishedTranslator: { $regex: qSearch, } },
//           { publisher: { $regex: qSearch, } },
//         ]
//       });
//     } else if (qPage) {
//       products = await Product.find().sort({ _id: 1 }).limit(LIMIT).skip(startIndex);
//     }
//     else {
//       products = await Product.find();
//     }

//     res.status(200).json({ data: products, currentPage: Number(qPage ?? 1), numberOfPage: Math.ceil(total / LIMIT) });
//     // res.status(200).json(products);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

router.get("/",productController.getProducts)
// router.get("/categories", async (req, res) => {
//   const qPage = req.query.page;
//   const qCategory = req.query.category;
//   const LIMIT = req.query.limit
//   try {
//     const startIndex = (Number(qPage) - 1) * LIMIT;
//     let total = await Product.find({
//       category: {
//         $in: [qCategory],
//       },
//     }).count()

//     let products = await Product.find({
//       category: {
//         $in: [qCategory],
//       },
//     }).sort({ _id: 1 }).limit(LIMIT).skip(startIndex);

//     res.status(200).json(
//       {
//         data: products,
//         currentPage: Number(qPage ?? 1),
//         numberOfPage: Math.ceil(total / LIMIT)
//       });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

module.exports = router;