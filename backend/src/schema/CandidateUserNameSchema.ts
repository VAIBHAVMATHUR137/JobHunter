import mongoose, { Document, Schema } from "mongoose";
interface CandidateUserName extends Document {
  username: string;
  password: string;
}
const CandidateUserNameSchema: Schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});
const CandidateUserName = mongoose.model<CandidateUserName>(
  "CandidateUserName",
  CandidateUserNameSchema
);
export default CandidateUserName;
