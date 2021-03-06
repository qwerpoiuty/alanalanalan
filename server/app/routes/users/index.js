'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var _ = require('lodash');
var User = mongoose.model('User')

var ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

router.get('/getData/:id', ensureAuthenticated, function(req, res) {
    User.findById(req.params.id).populate('groups').deepPopulate('groups.data').exec()
        .then(function(user) {
            res.json(user)
        })
})

router.put('/addGroup/:id', ensureAuthenticated, function(req, res) {
    User.findById(req.params.id).then(function(user) {
        console.log(user)
        user.groups.push(req.body.params.ids)
        user.save(function(err) {
            if (err) return next(err);
            res.status(200).send(user);
        })
    })
})

router.put('/removeGroup/:id', ensureAuthenticated, function(req, res) {
    User.findOne(req.params.id).then(function(user) {
        for (var i = 0; i < user.groups.length; i++) {
            if (user.groups[i] === req.body.params.ids) user.groups.splice(i + 1, 1)
        }
        user.save(function(err) {
            if (err) return next(err);
            res.status(200).send(user);
        })
    })
})