import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    duration: Number,
    available: [Date],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Service', serviceSchema);
