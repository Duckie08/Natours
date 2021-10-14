const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllReview = catchAsync(async (req, res, next) => {
  console.log(req.params.tourId);
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const review = await Review.find(filter);

  res.status(200).json({
    status: 'sucess',
    data: {
      review
    }
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      review: newReview
    }
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.body.id);

  res.status(200).json({
    status: 'success',
    data: {
      review
    }
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  await Review.findByIdAndUpdate(res.body.id);

  res.status(200).json({
    status: 'success',
    data: null
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(req.body.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'sucess',
    data: {
      review
    }
  });
});
