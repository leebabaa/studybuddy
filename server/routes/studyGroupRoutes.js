import express from "express";
import StudyGroup from "../models/studyGroup.js";
import User from "../models/userModel.js";
import ChatMessage from "../models/chatMessage.js";
import authenticateUser from "../middleware/authMiddleware.js";
import mongoose from "mongoose";

const router = express.Router();

// Get all study groups
router.get("/", async (req, res) => {
  try {
    const groups = await StudyGroup.find().populate("members", "name email");
    console.log("Fetched study groups:", groups);
    res.json(groups);
  } catch (error) {
    console.error("Error fetching study groups:", error);
    res.status(500).json({ message: "Error fetching study groups", error: error.message });
  }
});

// Get a specific study group by ID
router.get("/:groupId", async (req, res) => {
  try {
    const groupId = req.params.groupId;
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }
    const group = await StudyGroup.findById(groupId).populate("members", "name email");
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    console.log("Fetched group:", group);
    res.json(group);
  } catch (error) {
    console.error("Error fetching group by ID:", error);
    res.status(500).json({ message: "Error fetching group", error: error.message });
  }
});

// Get chat messages for a group with usernames
router.get("/:groupId/messages", authenticateUser, async (req, res) => {
  try {
    const groupId = req.params.groupId;
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }

    const messages = await ChatMessage.find({ groupId })
      .sort({ timestamp: 1 })
      .populate("userId", "name"); // Populate userId with name field from User model
    res.json(messages);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ message: "Error fetching chat messages", error: error.message });
  }
});

// Join a study group
router.post("/join/:groupId", authenticateUser, async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }

    const group = await StudyGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!Array.isArray(group.members)) {
      group.members = [];
    }

    if (!group.members.includes(userId)) {
      group.members.push(userId);
      await group.save();
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!Array.isArray(user.joinedGroups)) {
      user.joinedGroups = [];
    }

    if (!user.joinedGroups.includes(groupId)) {
      user.joinedGroups.push(groupId);
      await user.save();
    }

    res.json(group);
  } catch (error) {
    console.error("Error in join route:", error);
    res.status(500).json({ message: "Error joining study group", error: error.message });
  }
});

// Other routes...

export default router;