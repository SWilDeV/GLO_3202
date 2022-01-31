const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const config = require("../config/database");

//User schema
const UserSchema = mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	age: {
		type: String,
	},
	family: {
		type: String,
	},
	race: {
		type: String,
	},
	food: {
		type: String,
	},
	friends: {
		type: Array,
	},
});

const User = (module.exports = mongoose.model("User", UserSchema));

module.exports.getUserById = function (id, callback) {
	const query = { _id: id };
	User.findById(query, callback);
};

module.exports.getUserByUserName = function (username, callback) {
	const query = { username: username };
	User.findOne(query, callback);
};

module.exports.addUser = function (newUser, callback) {
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(newUser.password, salt, (err, hash) => {
			if (err) throw err;
			newUser.password = hash;
			newUser.save(callback);
		});
	});
};

module.exports.addFriend = function (userId, newFriends, callback) {
	console.log(newFriends);
	console.log(userId);
	User.findByIdAndUpdate(userId, newFriends, callback);
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
		if (err) throw err;
		callback(null, isMatch);
	});
};
