import mongoose, { Document, Schema } from 'mongoose';

export interface IEggProduction extends Document {
  date: Date;
  penNumber: number;
  quantity: number;
  damaged: number;
  notes?: string;
  recordedBy: mongoose.Types.ObjectId;
}

const eggProductionSchema = new Schema<IEggProduction>(
  {
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    penNumber: {
      type: Number,
      required: [true, 'Pen number is required'],
      ref: 'Pen',
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: 0,
    },
    damaged: {
      type: Number,
      default: 0,
      min: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
    recordedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
  },
  {
    timestamps: true,
  }
);

const EggProduction = mongoose.model<IEggProduction>('EggProduction', eggProductionSchema);

export default EggProduction;