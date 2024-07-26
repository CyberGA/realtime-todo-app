import { IUser } from "@/definitions/user.interface";
import mongoose, { Schema, Document } from "mongoose";

export interface IStoreUser extends Omit<IUser, "id">, Document {
  username: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
}, {
  timestamps: true,
});

export default mongoose.models.User ||
  mongoose.model<IStoreUser>("User", UserSchema);
