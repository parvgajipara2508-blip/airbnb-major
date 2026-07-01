const Listing = require("../models/listing")

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({})

    res.render("listings/index.ejs", { allListings })
};

module.exports.renderNewForm = (req, res) => {

    res.render("listings/new.ejs")
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: 'author' } }).populate("owner")
    if (!listing) {
        req.flash("error", "Listing you requested fordoes not exist!")
        res.redirect("/listings")
    }

    res.render("listings/ahow.ejs", { listing })
};

module.exports.createListing = async (req, res, next) => {

    console.log(req.file)
    const newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id;
    newListing.image = {
        url: req.file.path,
        filename: req.file.filename,
    };
    await newListing.save()
    req.flash("success", "New Listing Created!")
    res.redirect("/listings")

};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings");
    }

    console.log("Original URL:", listing.image.url);

    let orignalImageUrl = listing.image.url;
    orignalImageUrl = orignalImageUrl.replace(
        "/upload",
        "/upload/h_300,w_250"
    );

    console.log("Modified URL:", orignalImageUrl);

    return res.render("listings/edit.ejs", {
        listing,
        orignalImageUrl,
    });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    if (typeof req.file !== "undefined") {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename,
        }
        await listing.save();
    }
    req.flash("success", " Listing Updated!")
    res.redirect(`/listings/${id}`)
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params
    let deleteListing = await Listing.findByIdAndDelete(id)
    req.flash("success", " Listing Deleted!")
    res.redirect("/listings")

};