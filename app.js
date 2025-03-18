if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodeOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



//Router
const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const cartRoutes = require("./routes/cart");
//mongoDB setup
main().then(()=>{
    console.log("connected to db.");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/clothing");
}




//app set,use
app.set("view engine", "ejs");
app.set("views" ,path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodeOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 *1000,
        maxAge:  7 * 24 * 60 * 60 *1000,
        httpOnly: true,
    },
};



app.use(session(sessionOptions));
app.use(flash());

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//locals
app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    
    next(); 
})


//router
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/",userRouter);
app.use(cartRoutes);


//for all
app.all("*",(req, res, next)=>{
    throw new ExpressError(404, "Page Not Found!");
})

//Error Handlin
app.use((err, req, res, next)=>{
    let {statusCode= 500, message= " Something Went Wrong!"} = err;
    res.status(statusCode).render("listings/error.ejs",{err});
});

//app listen
app.listen(8080,()=>{
    console.log("app is running on port 8080.");
});