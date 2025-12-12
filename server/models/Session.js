// Session model - For sound healing sessions
import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: [true, "Session value is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    label: {
      type: String,
      required: [true, "Session label is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be positive"],
    },
    description: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ["INDIVIDUAL", "GROUP", "TEACHING"],
      default: "INDIVIDUAL",
    },
    image: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);

// Export model and CRUD functions
export const createSession = async (sessionData) => {
  const session = new Session(sessionData);
  return await session.save();
};

export const getAllSessions = async (filters = {}) => {
  const query = { isActive: true, ...filters };
  return await Session.find(query).sort({ createdAt: -1 });
};

export const getSessionById = async (id) => {
  return await Session.findById(id);
};

export const getSessionByValue = async (value) => {
  return await Session.findOne({ value, isActive: true });
};

export const updateSession = async (id, updateData) => {
  return await Session.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

export const deleteSession = async (id) => {
  // Soft delete - set isActive to false
  return await Session.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
};

export default Session;

