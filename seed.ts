import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { AdminUser } from './models/AdminUser';
import { Listing } from './models/Listing';
import { Content } from './models/Content';

dotenv.config();

const seed = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) throw new Error("No MONGODB_URI");
    await mongoose.connect(MONGODB_URI);

    // Initial Admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminFilter = { username: 'admin' };
    await (AdminUser as any).findOneAndUpdate(
      adminFilter,
      { password: hashedPassword },
      { upsert: true }
    );
    console.log("Admin user created/updated");

    // Clear and Seed Listings
    await Listing.deleteMany({});
    await Listing.create([
        {
          title: "County Group - Ivory County",
          description: "Ultra-luxury apartments offering an unparalleled living experience.",
          price: "₹3,50,00,000",
          location: "Sector 115, Noida",
          type: "Flat",
          beds: 4,
          baths: 4,
          sqft: 3500,
          featured: true,
          images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"]
        },
        {
          title: "Prestige Estates",
          description: "Premium plots in a gated community with world-class amenities.",
          price: "₹5,00,00,000",
          location: "Whitefield, Bangalore",
          type: "Plot",
          beds: 0,
          baths: 0,
          sqft: 5000,
          featured: true,
          images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80"]
        },
        {
          title: "DLF The Camellias",
          description: "Super luxury residences overlooking golf course.",
          price: "₹35,00,00,000",
          location: "Golf Course Road, Gurgaon",
          type: "Freehold",
          beds: 5,
          baths: 5,
          sqft: 7400,
          featured: true,
          images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"]
        },
        {
          title: "ATS Knightsbridge",
          description: "Exclusive penthouses and sky villas.",
          price: "₹15,00,00,000",
          location: "Sector 124, Noida",
          type: "Sell",
          beds: 4,
          baths: 5,
          sqft: 6000,
          featured: true,
          images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"]
        }
      ]);
      console.log("Initial listings seeded");

    // Initial Content
    await Content.findOneAndUpdate(
      { key: 'hero_title' },
      { value: 'Discover Your Modern Oasis', section: 'hero' },
      { upsert: true }
    );

    console.log("Seeding complete");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
