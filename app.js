const express = require("express");
const path = require("path");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");
const config = require("./config/database");
const session = require("express-session");
const users = require("./routes/users");

//connexion to database
mongoose.connect(config.database);

//connexion to database
mongoose.connect(config.database, { useMongoClient: true });
//error database
mongoose.connection.on("error", (err) => {
	console.log("database error" + err);
});

//Connexion to express
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Port
// const port = process.env.PORT || 8080;
const port = 3000;

app.use("/users", users);
//Cors Middleware

//Set static Folder
app.use(express.static(path.join(__dirname, "public")));

app.use(session({ secret: "secret", resave: true, saveUninitialized: true }));

//Passport Middleware
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

//index route
app.get("/", (req, res) => {
	res.send("Hello");
});

//start server
app.listen(port, () => {
	console.log(`server started on port ${port}`);
});
