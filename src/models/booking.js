import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    consumer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    service:{
      type: mongoose.Schema.Types.ObjectId,
      ref:'Service'
    },
    date: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Booking",bookingSchema)