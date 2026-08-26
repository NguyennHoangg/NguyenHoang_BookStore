const express = require("express");
const route = express.Router();
const {getReviews} = require("../controllers/user.controller");

route.get('/reviews', getReviews);

module.exports = route;
