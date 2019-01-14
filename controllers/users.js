const mongoose = require("mongoose");
const User = require("../models/users");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");

const connUri = process.env.MONGO_LOCAL_CONN_URL;

module.exports = {
  add: (req, res) => {
    mongoose.connect(
      connUri,
      { useNewUrlParser: true },
      err => {
        let result = {};
        let status = 201;
        if (!err) {
          const { name, password } = req.body;
          const user = new User({ name, password });

          user.save((err, user) => {
            if (!err) {
              result.status = status;
              result.result = user;
            } else {
              status = 500;
              result.status = status;
              result.error = err;
            }
            res.status(status).send(result);
          });
        } else {
          status = 500;
          result.status = status;
          result.error = err;
          res.status(status).send(result);
        }
      }
    );
  },

  login: (req, res) => {
    const { name, password } = req.body;

    mongoose.connect(
      connUri,
      { useNewUrlParser: true },
      err => {
        let result = {};
        let status = 200;
        if (!err) {
          User.findOne({ name }, (err, user) => {
            if (!err && user) {
              bcrypt.compare(password, user.password, function(err, match) {
                if (match) {
                  // Create a token
                  const payload = { user: user.name };
                  const options = {
                    expiresIn: "2d"
                  };
                  const secret = process.env.JWT_SECRET;
                  const token = jwt.sign(payload, secret, options);

                  result.token = token;
                  result.status = status;
                  result.result = user;
                } else {
                  status = 401;
                  result.status = status;
                  result.error = "Authentication error";
                }
                res.status(status).send(result);
              });
            } else {
              status = 404;
              result.status = status;
              result.error = err;
              res.status(status).send(result);
            }
          });
        } else {
          status = 500;
          result.status = status;
          result.error = err;
          res.status(status).send(result);
        }
      }
    );
  },

  getAll: (req, res) => {
    mongoose.connect(
      connUri,
      { useNewUrlParser: true },
      err => {
        let result = {};
        let status = 200;
        if (!err) {
          const payload = req.decoded;
          console.log("PAYLOAD", payload);
          if (payload && payload.user === "admin") {
            User.find({}, (err, users) => {
              if (!err) {
                result.status = status;
                result.error = err;
                result.result = users;
              } else {
                status = 500;
                result.status = status;
                result.error = err;
              }
              res.status(status).send(result);
            });
          } else {
            status = 401;
            result.status = status;
            result.error = `Authentication error`;
            res.status(status).send(result);
          }
        } else {
          status = 500;
          result.status = status;
          result.error = err;
          res.status(status).send(result);
        }
      }
    );
  }
};
