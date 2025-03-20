/**
 * Title: Write a program using JavaScript on // console Util

 * Date: 09, November 2023
 */

/* external import */
const colors = require("colors");

/* set colors as theme */
colors.setTheme({
  success: "cyan",
  error: "red",
  warning: "yellow",
});

exports.successMessage = (message) => {
  // console.log(`[Success] - ${message}`.success);
};

exports.warningMessage = (message) => {
  // console.log(`[Warning] - ${message}`.warning.italic);
};

exports.errorMessage = (message) => {
  // console.log(`[Error] - ${message}`.error.bold.italic);
};
