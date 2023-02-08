const User = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewere/verifyToken");
const userController = require('../controller/userController')

const router = require("express").Router();

//UPDATE _id user
router.put("/:id", verifyToken, userController.putUser);

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, userController.delete);

//GET USER for admin
router.get("/find/:id", verifyTokenAndAdmin, userController.getFindId);

//GET ALL USER for admin
router.get("/", verifyTokenAndAdmin, userController.getAll);

//GET USER STATS

router.get("/stats", verifyTokenAndAdmin, userController.stats);

module.exports = router;