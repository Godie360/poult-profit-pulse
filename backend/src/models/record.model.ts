import mongoose, { Document, Schema } from 'mongoose';

export interface IRecord extends Document {
    date: Date;
    recordType: 'eggProduction' | 'feedConsumption' | 'mortality' | 'income' | 'expense';
    penId?: mongoose.Types.ObjectId;
    quantity?: number;
    amount?: number;
    category?: string;
    description?: string;
    notes?: string;
    userId: mongoose.Types.ObjectId;
}

const recordSchema = new Schema<IRecord>(
    {
        date: {
            type: Date,
            required: [true, 'Date is required'],
            default: Date.now,
        },
        recordType: {
            type: String,
            enum: ['eggProduction', 'feedConsumption', 'mortality', 'income', 'expense'],
            required: [true, 'Record type is required'],
        },
        penId: {
            type: Schema.Types.ObjectId,
            ref: 'Pen',
        },
        quantity: {
            type: Number,
            min: 0,
        },
        amount: {
            type: Number,
            min: 0,
        },
        category: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        notes: {
            type: String,
            trim: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User reference is required'],
        },
    },
    { timestamps: true }
);

// Add validation based on record type
recordSchema.pre('validate', function(next) {
    if (this.recordType === 'eggProduction' || this.recordType === 'feedConsumption' || this.recordType === 'mortality') {
        if (!this.quantity) {
            this.invalidate('quantity', 'Quantity is required for this record type');
        }
        if (!this.penId) {
            this.invalidate('penId', 'Pen ID is required for this record type');
        }
    }

    if (this.recordType === 'income' || this.recordType === 'expense') {
        if (!this.amount) {
            this.invalidate('amount', 'Amount is required for this record type');
        }
        if (!this.category) {
            this.invalidate('category', 'Category is required for this record type');
        }
        if (!this.description) {
            this.invalidate('description', 'Description is required for this record type');
        }
    }

    next();
});

const Record = mongoose.model<IRecord>('Record', recordSchema);

export default Record;