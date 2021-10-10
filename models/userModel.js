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
    minlength: 8,
    select: false
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
  },
  passwordChangedAt: {
    type: Date,
    require: [true, 'An user must have a name']
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

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(this.passwordChangedAt, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};
const User = mongoose.model('User', userSchema);

module.exports = User;
