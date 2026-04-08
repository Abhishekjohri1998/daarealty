import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { AdminUser } from './models/AdminUser';
import { Listing } from './models/Listing';
import { Content } from './models/Content';
import TeamMember from './models/TeamMember';

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
        description: "Ultra-luxury apartments offering an unparalleled living experience. Featuring state-of-the-art architecture and premium finishes.",
        price: "₹3,50,00,000",
        location: "Sector 115, Noida",
        type: "Flat",
        beds: 4,
        baths: 4,
        sqft: 3500,
        featured: true,
        images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"],
        coordinates: { lat: 28.5708, lng: 77.3770 },
        amenities: ["Swimming Pool", "Gymnasium", "24/7 Security", "Club House", "Power Backup"],
        propertyStatus: "Under Construction",
        possession: "Dec 2026",
        reraNo: "UPRERAPRJ123456",
        developerName: "County Group"
      },
      {
        title: "Prestige Estates",
        description: "Premium plots in a gated community with world-class amenities and lush green landscapes.",
        price: "₹5,00,00,000",
        location: "Whitefield, Bangalore",
        type: "Plot",
        beds: 0,
        baths: 0,
        sqft: 5000,
        featured: true,
        images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80"],
        coordinates: { lat: 12.9698, lng: 77.7499 },
        amenities: ["Landscaped Garden", "Jogging Track", "Kids Play Area", "Covered Parking"],
        propertyStatus: "Ready to Move",
        possession: "Immediate"
      },
      {
        title: "DLF The Camellias",
        description: "Super luxury residences overlooking golf course. The pinnacle of luxury living in India.",
        price: "₹35,00,00,000",
        location: "Golf Course Road, Gurgaon",
        type: "Freehold",
        beds: 5,
        baths: 5,
        sqft: 7400,
        featured: true,
        images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"],
        coordinates: { lat: 28.4595, lng: 77.0266 },
        amenities: ["Swimming Pool", "Golf Course", "Gymnasium", "High-Speed WiFi", "Library"],
        propertyStatus: "Ready to Move",
        possession: "Immediate",
        reraNo: "HRERAPRJ789012",
        developerName: "DLF"
      },
      {
        title: "ATS Knightsbridge",
        description: "Exclusive penthouses and sky villas with breathtaking views of the city skyline.",
        price: "₹15,00,00,000",
        location: "Sector 124, Noida",
        type: "Sell",
        beds: 4,
        baths: 5,
        sqft: 6000,
        featured: true,
        images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"],
        coordinates: { lat: 28.5450, lng: 77.3340 },
        amenities: ["Swimming Pool", "Club House", "CCTV Surveillance", "Intercom", "Elevator"],
        propertyStatus: "Under Construction",
        possession: "June 2025"
      }
    ]);
    console.log("Initial listings seeded with enriched data");

    // Initial Content
    await Content.findOneAndUpdate(
      { key: 'hero_title' },
      { value: 'Discover Your Modern Oasis', section: 'hero' },
      { upsert: true }
    );
    await Content.findOneAndUpdate(
      { key: 'founder_image' },
      { value: '/assets/executive_portrait.png', section: 'about' },
      { upsert: true }
    );

    // Initial Team Members
    await TeamMember.deleteMany({});
    await TeamMember.create([
      {
        name: "Abhishek Johri",
        role: "Managing Director",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80",
        order: 1
      },
      {
        name: "Sarah Jenkins",
        role: "Head of Operations",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
        order: 2
      }
    ]);
    console.log("Team members and founder image seeded");

    console.log("Seeding complete");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
