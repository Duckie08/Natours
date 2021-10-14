const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'sucess',
    data: null
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet define! Please use /signup instead'
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //CREATE ERROR IF USER POST PASSWORD DATA
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for update password. Please use /updateMyPassword',
        400
      )
    );
  }
  //FILTER OUT UNWANTED FIELDS NAMES THAT ARE NOT ALLOWED TO BE UPDATED
  const filterBody = filterObj(req.body, 'name', 'email');
  //UPDATE USER DOC
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);

exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);
