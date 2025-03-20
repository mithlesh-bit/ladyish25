/**
 * Title: Write a program using JavaScript on Error Middleware

 * Date: 09, November 2023
 */

function error(err, _, res, _) {
  res.send({
    acknowledgement: false,
    message: err.name,
    description: err.message,
  });
}

module.exports = error;
