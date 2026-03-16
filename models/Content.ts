import mongoose, { Document, Schema } from 'mongoose';

export interface IContent extends Document {
  key: string;
  value: any;
  section: string;
  lastUpdated: Date;
}

const contentSchema = new Schema<IContent>({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true }, // Can be string or object
  section: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now },
});

export const Content = mongoose.models.Content || mongoose.model<IContent>('Content', contentSchema);
