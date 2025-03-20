/**
 * Title: Write a program using JavaScript on Favorite Controller

 * Date: 09, January 2024
 */

/* internal import */
const favoriteService = require("../services/favorite.service");

/* add to favorite */
exports.addToFavorite = async (req, res) => {
  try {
    await favoriteService.addToFavorite(req, res);
  } catch (error) {
    next(error);
  }
};

/* get favorites */
exports.getFavorites = async (req, res) => {
  try {
    await favoriteService.getFavorites(res);
  } catch (error) {
    next(error);
  } 
};

/* delete favorite */
exports.deleteFromFavorite = async (req, res) => {
  try {
    await favoriteService.deleteFromFavorite(req, res);
  } catch (error) {
    next(error);
  }
};
