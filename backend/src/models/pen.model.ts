import mongoose, { Document, Schema } from 'mongoose';

export interface IPen extends Document {
  penNumber: number;
  birdCount: number;
  birdType: string;
  ageInWeeks: number;
  status: 'active' | 'inactive';
  dailyEggProduction?: number;
  notes?: string;
}

const penSchema = new Schema<IPen>(
  {
    penNumber: {
      type: Number,
      required: [true, 'Pen number is required'],
      unique: true,
    },
    birdCount: {
      type: Number,
      required: [true, 'Bird count is required'],
      min: 0,
    },
    birdType: {
      type: String,
      required: [true, 'Bird type is required'],
      trim: true,
    },
    ageInWeeks: {
      type: Number,
      required: [true, 'Age in weeks is required'],
      min: 0,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    dailyEggProduction: {
      type: Number,
      default: 0,
      min: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Pen = mongoose.model<IPen>('Pen', penSchema);

export default Pen;