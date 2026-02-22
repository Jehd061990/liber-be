const express = require("express");
const router = express.Router();
const fineController = require("../controllers/fineController");
// const fineValidator = require('../validators/fineValidator'); // To be created

router.post("/", /*fineValidator.create,*/ fineController.createFine);
router.get("/", fineController.getFines);
router.get("/:id", fineController.getFine);
router.put("/:id", /*fineValidator.update,*/ fineController.updateFine);
router.delete("/:id", fineController.deleteFine);
router.post("/:id/pay", fineController.payFine);

module.exports = router;
