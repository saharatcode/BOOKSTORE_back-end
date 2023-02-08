const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewere/verifyToken");
const orderController = require("../controller/orderController")

const router = require("express").Router();

// GET MONTHLY INCOME
router.get("/income", verifyTokenAndAdmin, orderController.income)
//CREATE
router.post("/", verifyToken, orderController.postOrder)

//UPDATE
router.put("/:id", verifyToken, orderController.putOrder);

//DELETE
router.delete("/:id", verifyTokenAndAdmin, orderController.deleteOrder);

//GET USER ORDERS id user
router.get("/find/:id", verifyTokenAndAuthorization, orderController.getOrdersUser)
router.get("/", verifyTokenAndAdmin, orderController.getOrders)
router.get("/:id", verifyTokenAndAdmin, orderController.getOrderById);

module.exports = router;
