const router = require("express").Router();
const userRouter = require("./users.js");
const clothingItemRouter = require("./clothingItems.js");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

module.exports = router;
