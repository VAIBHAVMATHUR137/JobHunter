import mongoose, { Document, Schema } from "mongoose";

// Regex patterns
const passwordRegex: RegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

interface Login extends Document {
  email: string;
  password: string;
}
const loginSchema: Schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    validate: {
      validator: (value: string) => passwordRegex.test(value),
      message:
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.",
    },
  },
});

const Login = mongoose.model<Login>("Login", loginSchema);
export default Login;
