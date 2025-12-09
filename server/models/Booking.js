// Booking model - Mongoose schema matching the BookingModal form structure
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return false; // Phone is required
          // Indian phone number: 10 digits, optionally prefixed with +91
          const cleaned = v.replace(/\D/g, "");
          if (cleaned.startsWith("91") && cleaned.length === 12) {
            return true; // +91XXXXXXXXXX format
          }
          return cleaned.length === 10; // Standard 10-digit Indian number
        },
        message: "Please enter a valid 10-digit Indian phone number",
      },
    },
    serviceInterest: {
      type: String,
      required: [true, "Service interest is required"],
      enum: {
        values: [
          "chakra-therapy",
          "organ-therapy",
          "clinical-protocols",
          "corporate-wellness",
          "retreats-festivals",
          "lunar-sound-baths",
          "workshops",
          "gong-bowl-training",
          "other",
        ],
        message: "Please select a valid service interest",
      },
    },
    message: {
      type: String,
      trim: true,
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      enum: ["pending", "contacted", "confirmed", "cancelled"],
      default: "pending",
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

const Booking = mongoose.model("Booking", bookingSchema);

// Export model and CRUD functions
export const createBooking = async (bookingData) => {
  const booking = new Booking(bookingData);
  return await booking.save();
};

export const getBookings = async (options = {}) => {
  const { page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;

  const [bookings, total] = await Promise.all([
    Booking.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Booking.countDocuments(),
  ]);

  return {
    bookings,
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / limit),
  };
};

export const getBookingById = async (id) => {
  return await Booking.findById(id);
};

export const updateBooking = async (id, updateData) => {
  return await Booking.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

export const deleteBooking = async (id) => {
  return await Booking.findByIdAndDelete(id);
};

export default Booking;
