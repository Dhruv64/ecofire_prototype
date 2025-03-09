
import mongoose from "mongoose";

export interface Owner extends mongoose.Document {
  _id: string;
  name: string;
  userId: string;
}

const OwnerSchema = new mongoose.Schema<Owner>({
  userId: {
    type: String,
    required: [true, "User ID is required"],
    index: true
  },
  name: {
    type: String,
    required: [true, "Please provide a name for this Owner."],
  }
});

export default mongoose.models.Owner || 
  mongoose.model<Owner>("Owner", OwnerSchema);
