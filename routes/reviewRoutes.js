const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

//To access param from another routers use merge params
const router = express.Router({
    mergeParams: true
});

// POST /tour/3434/reviews
// GET /tour/3434/reviews
// POST /reviews

router.route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.protect,
        authController.restrictTo('user'),
        reviewController.setTourUserIds,
        reviewController.createReview);

router.route('/:id')
    .patch(reviewController.updateReview)
    .delete(reviewController.deleteReview);

module.exports = router;