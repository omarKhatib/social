var express = require("express");
var jwt = require("jsonwebtoken");
var config = require("../config.js");
var authRouter = express.Router();

//import models
var User = require("../models/user.js");

//signup




authRouter.get("/", function(req, res){   //just for testing
    
        User.find({}, function (err, data) {
        if (err) {
            res.status(500).send({
                message: 'internal server error'
            });

        } else {

            res.status(200).send({
                data: data
            });

        }





    })
    
    
});

authRouter.get("/:username", function (req, res) {
    User.findOne({
        username: req.params.username
    }, function (err, data) {
        if (err) {
            res.status(500).send({
                message: 'internal server error'
            });

        } else {

            res.status(200).send({
                data: data
            });

        }





    })

});




authRouter.post("/signup", function(req, res) {
  //If the username is already taken
  //If not then add the user
    console.log(req.body);
  User.find({username: req.body.username}, function(err, data) {
    if(err) {
      res.status(500).send({"message": "Error", err: err});
    } else if(data.length > 0) {
      res.status(409).send({"message": "Username is taken"});
    } else {
      var newUser = new User(req.body);
      newUser.save(function(err, data) {
        if(err) {
          res.status(500).send({"message": "Error", err: err});
        } else {
          res.status(200).send({"message": "You just signed up for an account", data: data});
        }
      });
    }
  });
});

//signin
authRouter.post("/signin", function(req, res) {
  //if someone with the username exists
  //if the password mathces
  User.findOne({username: req.body.username}, function(err, data) {
    console.log(data);
    if(err) {
      res.status(500).send({"message": "Error", err: err});
    } else if(data === null) {
      res.status(404).send({"message": "Username does not exist"});
    } else if(data.password != req.body.password) {
      res.status(403).send({"message": "Passwords did not match"});
    } else {
      //send the json web token
      var token = jwt.sign(data.toObject(), config.secret, {"expiresIn": "1h"});
      res.status(200).send({"message": "Here is your token sir", token: token, user: data.username});
    }
  });
});

authRouter.put("/:username", function (req, res) {  //update personal info
    console.log(req.body);
 User.findOne({
        username: req.params.username
    }, function (err, data) {
        if (err) {
            res.status(500).send({
                message: 'internal error' + err
            });

        } else if (data == undefined) {

            res.status(404).send({
                message: 'not found'
            });
        } else {
            for (key in req.body) {
                data[key] = req.body[key]

            }



            data.save();
            res.status(200).send({
                updatedData: data
            })


        }

    });


});


authRouter.post("/:username", function (req, res) { //to add comment
    var follower = req.body.follower;
    data.findOne({
        username: req.params.username
    }, function (err, d) {
        if (err) {
            res.status(500).send({
                message: 'error'
            });

        } else {
            d.followers.push(follower);
            d.save(function (err, data) {
                if (err) {
                    res.status(500).send({
                        message: 'error'
                    });


                } else {
                    res.status(200).send({
                        'data': data
                    });
                }

            });


        }


    })


});




module.exports = authRouter;
