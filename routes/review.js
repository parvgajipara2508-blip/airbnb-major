const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js")
const Reviews = require("../models/review.js")
const Listing = require("../models/listing.js");
const { openDelimiter } = require("ejs");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");



//reviews
//post route
router.post("/", validateReview, isLoggedIn, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Reviews(req.body.review)
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created!")
    res.redirect(`/listings/${listing._id}`);
}))

//reviews
//delete route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Reviews.findByIdAndDelete(reviewId);
    req.flash("success", " Review Created!")
    res.redirect(`/listings/${id}`)
}))


module.exports = router;