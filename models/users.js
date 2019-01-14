const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

const environement = process.env.NODE_ENV;
const stage = require("../config.js")[environement];

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: "String",
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: "String",
    required: true,
    trim: true
  }
});

userSchema.pre("save", function(next) {
  const user = this;
  if (!user.isModified || !user.isNew) {
    next();
  } else {
    bcrypt.genSalt(stage.saltingRounds, function(err, salt) {
      bcrypt.hash(user.password, salt, null, (err, hash) => {
        if (err) {
          console.log("Error hashing password for user: ", user.name);
          next(err);
        } else {
          user.password = hash;
          next();
        }
      });
    });
  }
});

module.exports = mongoose.model("User", userSchema);
