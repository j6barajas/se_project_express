const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const {
  validateClothingItemBody,
  validateIds,
} = require("../middlewares/validation");
const auth = require("../middlewares/auth");

router.get("/", getClothingItems);
router.post("/", validateClothingItemBody, auth, createClothingItem);
router.delete("/:itemId", validateIds, auth, deleteClothingItem);
router.put("/:itemId/likes", validateIds, auth, likeItem);
router.delete("/:itemId/likes", validateIds, auth, dislikeItem);

module.exports = router;
