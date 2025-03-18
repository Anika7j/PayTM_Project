const express = require("express");
const router = express.Router();
const userRouter = require("./user");
const accountRuoter = require("./account");

router.use("/user",userRouter);
router.use("/account",accountRuoter);

module.exports = router;