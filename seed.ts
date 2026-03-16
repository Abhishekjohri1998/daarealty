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

    // Initial Listings
    const listingsCount = await Listing.countDocuments();
    if (listingsCount === 0) {
      await Listing.create([
        {
          title: "The Glass House",
          description: "Modern masterpiece with stunning views",
          price: "$2,450,000",
          location: "Beverly Hills, CA",
          type: "Sale",
          beds: 4,
          baths: 3,
          sqft: 3200,
          featured: true,
          images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"]
        },
        {
          title: "Modern Minimalist",
          description: "Sleek design in the heart of Austin",
          price: "$1,850,000",
          location: "Austin, TX",
          type: "Sale",
          beds: 3,
          baths: 2,
          sqft: 2400,
          featured: true,
          images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c"]
        }
      ]);
      console.log("Initial listings seeded");
    }

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
