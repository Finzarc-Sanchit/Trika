// Retreat model - For sound healing retreats
import mongoose from "mongoose";

const retreatSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Retreat name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be positive"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Date is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    maxCapacity: {
      type: Number,
      default: 20,
      min: [1, "Capacity must be at least 1"],
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

const Retreat = mongoose.model("Retreat", retreatSchema);

// Export model and CRUD functions
export const createRetreat = async (retreatData) => {
  const retreat = new Retreat(retreatData);
  return await retreat.save();
};

export const getAllRetreats = async (filters = {}) => {
  const query = { isActive: true, ...filters };
  return await Retreat.find(query).sort({ createdAt: -1 });
};

export const getRetreatById = async (id) => {
  return await Retreat.findById(id);
};

export const updateRetreat = async (id, updateData) => {
  return await Retreat.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

export const deleteRetreat = async (id) => {
  // Soft delete - set isActive to false
  return await Retreat.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
};

export default Retreat;

