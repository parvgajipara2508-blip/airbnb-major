const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js")
const Reviews = require("../models/review.js")
const Listing = require("../models/listing.js");
const { openDelimiter } = require("ejs");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");



//reviews
//post route
router.post("/", validateReview, isLoggedIn, wrapAsync(reviewController.createReview));

//reviews
//delete route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));


module.exports = router;