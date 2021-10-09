const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'An user must have a name']
  },
  email: {
    type: String,
    require: [true, 'An user must have an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  password: {
    type: String,
    require: [true, 'An user must have a password'],
    minlength: 8
  },
  passwordConfirm: {
    type: String,
    require: [true, 'Please confirm your password'],
    validate: {
      //this only work on CREATE, SAVE
      validator: function(el) {
        return el === this.password;
      },
      message: 'Password is not the same'
    }
  }
});

userSchema.pre('save', async function(next) {
  //Only run if password if password is acutuallu modified
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  //delete password confirm field
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
