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
  topology?: string;
  propertyStatus?: string;
  superArea?: string;
  carpetArea?: string;
  possession?: string;
  amenities?: string[];
  floorPlans?: string[];
  reraNo?: string;
  reraProjectName?: string;
  reraQrCode?: string;
  aboutDeveloper?: string;
  developerName?: string;
  faq?: { question: string; answer: string }[];
  brochureUrl?: string;
  locationMapUrl?: string;
}

const listingSchema = new Schema<IListing>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  location: { type: String, required: true },
  images: [{ type: String }],
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
  topology: { type: String },
  propertyStatus: { type: String },
  superArea: { type: String },
  carpetArea: { type: String },
  possession: { type: String },
  amenities: [{ type: String }],
  floorPlans: [{ type: String }],
  reraNo: { type: String },
  reraProjectName: { type: String },
  reraQrCode: { type: String },
  aboutDeveloper: { type: String },
  developerName: { type: String },
  faq: [{ question: { type: String }, answer: { type: String } }],
  brochureUrl: { type: String },
  locationMapUrl: { type: String },
});

export const Listing = mongoose.models.Listing || mongoose.model<IListing>('Listing', listingSchema);