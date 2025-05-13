// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phoneNumber: {
    type: String,
    required: true,
    match: [/^\+92\d{10}$/, 'Phone number must be in the format +923001234567'],
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(v);
      },
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    },
  },
  role: { type: String, required: true, enum: ['farmer', 'rider', 'buyer', 'admin'] },
  address: { type: String, required: true },
  city: { type: String, required: true },
  zipCode: { type: String, required: true, match: [/^\d{5}$/, 'Zip code must be 5 digits'] },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
