import mongoose from "mongoose";

const StudyGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true }, // Ensure description is lowercase and required
  image: { type: String, required: true }, // Store image URL
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Store member count as a number
});

const StudyGroup = mongoose.model("StudyGroup", StudyGroupSchema);
export default StudyGroup;
