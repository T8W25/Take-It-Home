const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware.js");
const { getTradeItems, createTradeItems, updateTradeItem, deleteTradeItem } = require("../controllers/tradeItem.controller.js");

//  GET ALL TRADE ITEMS
router.get("/", getTradeItems);

//  CREATE A NEW TRADE ITEM
router.post("/", upload.single("image"), createTradeItems);

//  UPDATE A TRADE ITEM
router.put("/:id", upload.single("image"), updateTradeItem);

//  DELETE A TRADE ITEM
router.delete("/:id", deleteTradeItem);

module.exports = router;
