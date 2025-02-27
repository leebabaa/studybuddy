import express from "express";
import StudyGroup from "../models/studyGroup.js";
import User from "../models/userModel.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all study groups
router.get("/", async (req, res) => {
  try {
    const groups = await StudyGroup.find().populate("members", "name email");
    res.json(groups);
  } catch (error) {
    console.error("Error fetching study groups:", error);
    res.status(500).json({ message: "Error fetching study groups", error: error.message });
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

    if (!group.members.includes(userId)) {
      group.members.push(userId);
      await group.save();
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.joinedGroups) user.joinedGroups = [];
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

// Other routes remain unchanged...

export default router;