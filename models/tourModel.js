const mongoose = require('mongoose');
const validator = require('validator');

const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, 'A tour must has a name'],
      unique: true,
      maxlength: [40, 'A tour name must have less or equal than 40 charactes'],
      minlength: [6, 'A tour name must have more or equal than 6 charactes'],
      validate: {
        validator: function(value) {
          return validator.isAlpha(value.split(' ').join(''));
        },
        message: 'Tour name must only contain characters.'
      }
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium, difficult'
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be abbove 1.'],
      max: [5, 'Rating must be below 5']
    },
    ratingQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          //this only point to current doc on new document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) must smaller than price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have description']
    },
    desciption: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

//DOCUMENT MIDDLEWARE RUN BEFORE .save() and create()
// tourSchema.pre('save', function(next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

// tourSchema.pre('save', function(next) {
//   console.log('Will  save doc');
//   next();
// });
// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

//QUERRY MIDDLEWARE
tourSchema.pre(/^find/, function(next) {
  // tourSchema.pre('find', function(next) {
  this.find({ secreteTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.post(/find/, function(docs, next) {
  console.log(`Querry toook ${Date.now() - this.start} milisecond`);
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline);
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
