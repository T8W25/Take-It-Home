// const express = require("express");
// const router = express.Router();

// const multer = require("multer");
// const { verifyToken } = require("../middleware/authmiddleware");
// const {
//   getTradeItems,
//   createTradeItem,
//   updateTradeItem,
//   deleteTradeItem,
//   searchTradeItems,
//   getTradeItemById,
//   getTradeItemsByUser
// } = require("../controllers/tradeItem.controller");

// // ✅ Multer Setup
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });
// const upload = multer({ storage });

// // ✅ Routes
// router.get("/all", getTradeItems);
// router.get("/search", searchTradeItems);
// router.get("/:id", getTradeItemById);
// router.get("/user", verifyToken, getTradeItemsByUser);
// router.post(
//   "/post",
//   verifyToken,
//   upload.fields([
//     { name: "image", maxCount: 1 },
//     { name: "video", maxCount: 1 },
//   ]),
//   createTradeItem
// );

// router.put(
//   "/update/:id",
//   verifyToken,
//   upload.fields([
//     { name: "image", maxCount: 1 },
//     { name: "video", maxCount: 1 }
//   ]),
//   updateTradeItem
// );


// router.delete("/delete/:id", verifyToken, deleteTradeItem);

// module.exports = router;

const express = require("express");
const router = express.Router();

// ── MULTER SETUP ────────────────────────────────────────────────────────────────
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });
// ────────────────────────────────────────────────────────────────────────────────

const { verifyToken } = require("../middleware/authmiddleware");
const {
  getTradeItems,
  createTradeItem,
  updateTradeItem,
  deleteTradeItem,
  searchTradeItems,
  getTradeItemById,
  getTradeItemsByUser
} = require("../controllers/tradeItem.controller");

// ✅ Get all trade items
router.get("/all", getTradeItems);

// ✅ Get only this user’s trade items
router.get("/user", verifyToken, getTradeItemsByUser);

// ✅ Search trade items
router.get("/search", searchTradeItems);

// ✅ Get a single trade item by ID
router.get("/:id", getTradeItemById);

// ✅ Create a new trade item (image + optional video)
router.post(
  "/post",
  verifyToken,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  createTradeItem
);

// ✅ Update a trade item
router.put(
  "/update/:id",
  verifyToken,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  updateTradeItem
);

// ✅ Delete a trade item
router.delete("/delete/:id", verifyToken, deleteTradeItem);

module.exports = router;
