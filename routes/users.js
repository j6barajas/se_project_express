const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { validateUserInfoUpdate } = require("../middlewares/validation");
const auth = require("../middlewares/auth");

router.get("/me", auth, getCurrentUser);
router.patch("/me", validateUserInfoUpdate, auth, updateProfile);

module.exports = router;
