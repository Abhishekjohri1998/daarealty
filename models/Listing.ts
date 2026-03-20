import mongoose, { Document, Schema } from 'mongoose';

export interface IListing extends Document {
  title: string;
  description: string;
  price: string;
  location: string;
  images: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  type: 'Plot' | 'Sell' | 'Freehold' | 'Flat';
  beds?: number;
  baths?: number;
  sqft?: number;
  featured: boolean;
  createdAt: Date;
}

const listingSchema = new Schema<IListing>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  location: { type: String, required: true },
  images: [{ type: String }], // Array of S3/Local URLs
  coordinates: {
    lat: { type: Number, default: 28.6790 },
    lng: { type: Number, default: 77.4453 }
  },
  type: { type: String, enum: ['Plot', 'Sell', 'Freehold', 'Flat'], default: 'Sell' },
  beds: { type: Number },
  baths: { type: Number },
  sqft: { type: Number },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Listing = mongoose.models.Listing || mongoose.model<IListing>('Listing', listingSchema);
