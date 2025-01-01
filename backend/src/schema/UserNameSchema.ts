import mongoose, { Document, Schema } from "mongoose";
interface UserName extends Document {
  username: string;
}
const UserNameSchema: Schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
});
const UserName = mongoose.model<UserName>("UserName", UserNameSchema);
export default UserName;
