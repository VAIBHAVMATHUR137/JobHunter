import mongoose, {  Schema } from "mongoose";
interface jobIdSchema {
  username: string;
  jobID: string;
}
const jobIdSchema: Schema = new mongoose.Schema({
  jobID: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
});
export const jobIDSchema = mongoose.model<jobIdSchema>("jobIdSchema", jobIdSchema);
