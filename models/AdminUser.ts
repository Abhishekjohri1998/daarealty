import mongoose, { Document, Schema } from 'mongoose';

export interface IAdminUser extends Document {
  username: string;
  password: string;
  role: string;
}

const adminUserSchema = new Schema<IAdminUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed
  role: { type: String, default: 'admin' },
});

export const AdminUser = mongoose.models.AdminUser || mongoose.model<IAdminUser>('AdminUser', adminUserSchema);
