const userModel = require("../models/user.model");

const getReviews = async () => {
  try {
    const reviews = await userModel.getReviews();
    return reviews;
  } catch (error) {
    throw error;
  }
};

module.exports = { getReviews };