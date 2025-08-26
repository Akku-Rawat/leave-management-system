const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leaveController");

router.get("/", leaveController.getLeaves);
router.post("/", leaveController.createLeave);

module.exports = router;
