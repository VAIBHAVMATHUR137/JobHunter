import mongoose, { Document, Schema } from 'mongoose';

// Regex patterns
const passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const mobileNumberRegex: RegExp = /^(\+\d{1,3}[- ]?)?\d{10}$/;

interface IRecruiter extends Document{
    name:string,
    number:number,
    email:string,
    password:string,
    company:string,
    location:string
}
const recruiterSchema:Schema=new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },

      number: {
        type: Number,
        required: [true, "Mobile number is required"],
        unique: true,
        validate: {
          validator: (value: string) => mobileNumberRegex.test(value),
          message: "Please enter a valid mobile number.",
        },
      },
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
      company:{
        type:String,
        required:true
      },
      location:{
        type:String,
        required:true
      }

})
const Recruiter = mongoose.model<IRecruiter>('Recruiter',recruiterSchema);
export default Recruiter;