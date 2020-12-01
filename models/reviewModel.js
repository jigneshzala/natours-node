const mongoose = require("mongoose");
const Tour = require("./tourModel");

const reviewSchema = new mongoose.Schema({

    review: {
        type: String,
        required: [true, 'Review is required'],
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'review must belong to a user']
    }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

// Will add tour and user embded object to every find query
reviewSchema.pre(/^find/, function (next) {
    //Populate method is used to get reltive object by id
    /*   this.populate({
          path: 'tour',
          select: 'name'
      }).populate({
          path: 'user',
          select: 'name photo' 
      }); */
    this.populate({
        path: 'user',
        select: 'name photo'
    });
    next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
    const stats = await this.aggregate([{
        $match: {
            tour: tourId
        }
    }, {
        $group: {
            _id: '$tour',
            nRating: {
                $sum: 1
            },
            avgRating: {
                $avg: '$rating'
            }
        }
    }]);

    await Tour.findByIdAndUpdate(tourId, {
        ratingsQuantity: stats[0].nRating,
        ratingsAverage: stats[0].avgRating
    });

}


reviewSchema.post('save', function () {
    // this points to current review

    this.constructor.calcAverageRatings(this.tour);

});
//Will create collection
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;