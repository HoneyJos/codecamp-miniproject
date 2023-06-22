import mongoose, { Schema } from "mongoose";


const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  personal: String,
  prefer: String,
  pwd: String,
  phone: {
    type: String,
    unique: true
  },
  og: Schema.Types.Mixed
})

export const User = mongoose.model('User', userSchema);