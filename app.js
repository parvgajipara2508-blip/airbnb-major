const express = require("express")
const app = express()
const mongoose = require("mongoose")
const path = require("path")
const methodOverride = require("method-override")
const ejs = require('ejs');
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session")
const flash = require("connect-flash")

const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")


app.engine("ejs", ejsMate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "/public")))

app.use(session({
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}));
app.use(flash())
app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error")
    next();
});


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"

main()
    .then(() => {
        console.log("connected to DB");

    }).catch((err) => {
        console.log(err);

    })

async function main() {
    await mongoose.connect(MONGO_URL)
}

app.get("/", (req, res) => {
    res.send("working")
})




app.use("/listings", listings)
app.use("/listings/:id/reviews", reviews)




app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Someting went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message })
    // res.status(statusCode).send(message);
})



app.listen(8080, () => {
    console.log("server is listning to the port 8080");

})