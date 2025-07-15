// scripts/seed-admin.ts
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ["admin", "user"], default: "user" },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    const existing = await User.findOne({ email: "admin@relixcore.com" });

    if (existing) {
      console.log("✅ Admin already exists:", existing.email);
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = new User({
      name: "Admin User",
      email: "admin@relixcore.com",
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("🎉 Admin user created:", admin.email);
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
  } finally {
    mongoose.connection.close();
  }
}

seedAdmin();
