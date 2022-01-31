const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config/database");
var async = require("async");

//INDEX ROUTE
router.get("/dashboard", function (req, res) {
	User.find({}, function (err, allUsers) {
		if (err) {
			console.log(err);
		} else {
			res.json(allUsers);
		}
	});
});

//register
router.post("/register", (req, res, next) => {
	let newUser = new User({
		email: req.body.email,
		username: req.body.username,
		password: req.body.password,
		race: req.body.race,
		age: req.body.age,
		family: req.body.family,
		food: req.body.food
	});

	User.addUser(newUser, (err, user) => {
		if (err) {
			res.json({ success: false, msg: "Failed to register user" });
		} else {
			res.json({ success: true, msg: "user registered" });
		}
	});
});

//Authentication
router.post("/authenticate", (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;

	User.getUserByUserName(username, (err, user) => {
		if (err) throw err;
		if (!user) {
			return res.json({ success: false, msg: "User not found" });
		}
		User.comparePassword(password, user.password, (err, isMatch) => {
			if (err) throw err;
			if (isMatch) {
				const token = jwt.sign({ data: user }, config.secret, {
					expiresIn: 604800, // 1 week
				});
				res.json({
					success: true,
					token: "JWT " + token,
					user: {
						id: user._id,
						username: user.username,
						email: user.email,
						friends: user.friends,
						race: user.race,
						age: user.age,
						family: user.family,
						food: user.food,
					},
				});
			} else {
				return res.json({ success: false, msg: "Wrong password" });
			}
		});
	});
});

//Profile get friends only
router.get(
	"/profile",
	passport.authenticate("jwt", { session: false }),
	// (req, res, next) => {
	// 	res.json({ user: req.user });
	// }
	(req, res, next) => {
		const user = req.user;
		const arr = req.user.friends;
		let friends = [];

		User.find({
			_id: { $in: arr },
		})
			.then((docs) =>
				res.json({
					friends: docs,
					user: user,
				})
			)
			.catch((err) => console.log(err));
	}
);

//Update friends
router.put(`/edit/:id`, (req, res, next) => {
	let newFriends = {
		friends: req.body.friends,
	};
	User.addFriend(req.params.id, newFriends, (err) => {
		if (err) {
			res.json({ success: false, msg: "Failed to register user" });
		} else {
			res.json({ success: true, msg: "Friend added" });
		}
	});
});

module.exports = router;
