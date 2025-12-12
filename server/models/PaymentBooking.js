// Payment Booking model - For paid session and retreat bookings
import mongoose from "mongoose";

const paymentBookingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "Booking type is required"],
      enum: ["session", "retreat"],
    },
    sessionType: {
      type: String,
      required: function() {
        return this.type === "session";
      },
    },
    retreatId: {
      type: String,
      required: function() {
        return this.type === "retreat";
      },
    },
    numberOfPeople: {
      type: Number,
      required: [true, "Number of people is required"],
      min: [1, "At least 1 person is required"],
      max: [10, "Maximum 10 people allowed"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      validate: {
        validator: function (v) {
          const cleaned = v.replace(/\D/g, "");
          if (cleaned.startsWith("91") && cleaned.length === 12) {
            return true;
          }
          return cleaned.length === 10;
        },
        message: "Please enter a valid 10-digit Indian phone number",
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Please enter a valid email address",
      },
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be positive"],
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
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

const PaymentBooking = mongoose.model("PaymentBooking", paymentBookingSchema);

// Export model and CRUD functions
export const createPaymentBooking = async (bookingData) => {
  const booking = new PaymentBooking(bookingData);
  return await booking.save();
};

export const getPaymentBookingById = async (id) => {
  return await PaymentBooking.findById(id);
};

export const updatePaymentBooking = async (id, updateData) => {
  return await PaymentBooking.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

export const getPaymentBookingByOrderId = async (orderId) => {
  return await PaymentBooking.findOne({ razorpayOrderId: orderId });
};

export const getAllPaymentBookings = async (options = {}) => {
  const { page = 1, limit = 10, status, paymentStatus, type } = options;
  const skip = (page - 1) * limit;

  // Build query
  const query = {};
  if (status) query.status = status;
  if (paymentStatus) query.paymentStatus = paymentStatus;
  if (type) query.type = type;

  const [bookings, total] = await Promise.all([
    PaymentBooking.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    PaymentBooking.countDocuments(query),
  ]);

  return {
    bookings,
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / limit),
  };
};

export const getPaymentBookingStats = async () => {
  const [
    totalBookings,
    confirmedBookings,
    pendingBookings,
    cancelledBookings,
    totalRevenue,
    sessionBookings,
    retreatBookings,
  ] = await Promise.all([
    PaymentBooking.countDocuments(),
    PaymentBooking.countDocuments({ status: 'confirmed', paymentStatus: 'completed' }),
    PaymentBooking.countDocuments({ status: 'pending' }),
    PaymentBooking.countDocuments({ status: 'cancelled' }),
    PaymentBooking.aggregate([
      { $match: { paymentStatus: 'completed', status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    PaymentBooking.countDocuments({ type: 'session' }),
    PaymentBooking.countDocuments({ type: 'retreat' }),
  ]);

  return {
    totalBookings,
    confirmedBookings,
    pendingBookings,
    cancelledBookings,
    totalRevenue: totalRevenue[0]?.total || 0,
    sessionBookings,
    retreatBookings,
  };
};

export default PaymentBooking;

