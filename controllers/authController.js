const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signinToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt
  });

  const token = signinToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //Check if email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  //Check user exist && password correct
  const user = await User.findOne({ email: email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorect email or password', 401));
  }

  //if ok send token to client
  const token = signinToken(user._id);
  res.status(200).json({
    status: 'suceess',
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //Get token and check if exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in, please login to get acces', 401)
    );
  }
  //validate token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //check if user exist
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError('The user belong to this token is not exsits'),
      401
    );
  }
  //check if user change password after the token was issue
  if (freshUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password, please log in again', 401)
    );
  }
  req.user = freshUser;
  next();
});
