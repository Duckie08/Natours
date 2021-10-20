const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  //Set tour data from the collection
  const tours = await Tour.find();
  //Build template
  //Render that template

  res.status(200).render('overview', {
    title: 'All tours',
    tours
  });
});

exports.getTour = async (req, res) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  res.status(200).render('tour', {
    title: 'The forese',
    tour
  });
};
