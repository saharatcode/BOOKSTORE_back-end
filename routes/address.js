const addressController = require("../controller/addressController");
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("../middlewere/verifyToken");

const router = require("express").Router();

router.post("/", verifyToken, addressController.postAdress)
router.get("/:id", verifyToken, addressController.getAdress)
router.put("/:id", verifyToken, addressController.putAdress)
router.delete("/:id", verifyToken, addressController.deleteAdress)

module.exports = router;