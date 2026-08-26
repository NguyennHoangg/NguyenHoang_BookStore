const { getReviews: getReviewsService } = require("../services/user.service");

const getReviews = async (req, res, next) => {
  try {
    const reviews = await getReviewsService();
    return res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

module.exports = { getReviews };