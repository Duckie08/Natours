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

  res
    .status(200)
    .set(
      'Content-Security-Policy',
      'connect-src https://*.tiles.mapbox.com https://api.mapbox.com https://events.mapbox.com'
    )
    .render('tour', {
      title: `${tour.name} Tour`,
      tour
    });
};

exports.login = (req, res) => {
  res.status(200).render('login', {
    title: 'Login your accout'
  });
};
