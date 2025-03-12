import Item from "../models/item.model.js";
import mongoose from "mongoose";

//get all items
export const getItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json({ success: true, data: items });
    } catch (error) {
        console.error("Error in fetching items:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


//create an item
export const createItems = async (req, res) => {
    const item = req.body; //user will send this data
 
    if (!item.name || !item.description || !item.category || !item.condition || !item.image) {
        return res.status(400).json({ success: false, message: "Please enter all fields" });
    }
 
    const newItem = new Item(item);
 
    try{
     await newItem.save();
     res.status(201).json({ success: true, data: newItem,  message: "Item added successfully" });
    }
    catch (error) {
     console.error("Error in create item:", error.message);
     res.status(500).json({ success: false, message: "Server Error" });
    }
 };


 //update an item
 export const updateItem = async (req, res) => {
    const { id } = req.params;
    const item = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Id" });
    }

    try {
        const updatedItem = await Item.findByIdAndUpdate(id, item, { new: true });
        res.status(200).json({ success: true, data: updatedItem, message: "Item updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error, Item not found" });
    }
};

//delete an item
export const deleteItem = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Id" });
    }
    
    try {
        await Item.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Item deleted successfully" });
    } catch (error) {
        console.error("Error in delete item:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
