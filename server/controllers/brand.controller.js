const brandService = require("../services/brand.service");

/* add new brand */
exports.addBrand = async (req, res, next) => {
  try {
    await brandService.addBrand(req, res);
  } catch (error) {
    next(error);
  }
};

/* get all brands */
exports.getBrands = async (req, res, next) => {
  try {
    await brandService.getBrands(res);
  } catch (error) {
    next(error);
  }
};

/* get a brand */
exports.getBrand = async (req, res, next) => {
  try {
    await brandService.getBrand(req, res);
  } catch (error) {
    next(error);
  }
};

/* update brand */
exports.updateBrand = async (req, res, next) => {
  try {
    await brandService.updateBrand(req, res);
  } catch (error) {
    next(error);
  }
};

/* delete brand */
exports.deleteBrand = async (req, res, next) => {
  try {
    await brandService.deleteBrand(req, res);
  } catch (error) {
    next(error);
  }
};
