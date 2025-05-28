const router = require("express").Router();
const {
  getUsers,
  createUser,
  getCurrentUser,
  updateProfile,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/me", getCurrentUser);
router.post("/", createUser);
router.patch("/me", updateProfile);

module.exports = router;
