import mongoose, { Document, Schema } from "mongoose";
interface RecruiterUserName extends Document {
  username: string;
  password:string
}
const RecruiterUserNameSchema: Schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password:{
    type:String,
    required:true
  }
});
const RecruiterUserName = mongoose.model<RecruiterUserName>("RecruiterUserName", RecruiterUserNameSchema);
export default RecruiterUserName;
