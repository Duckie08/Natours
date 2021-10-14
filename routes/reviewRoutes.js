const express = require('express');

const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/');

router
  .route('/')
  .get(authController.protect, reviewController.getAllReview)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

router
  .route('/:id')
  .get(authController.protect, reviewController.getReview)
  .patch(authController.protect, reviewController.updateReview)
  .delete(authController.protect, reviewController.deleteReview);

module.exports = router;
