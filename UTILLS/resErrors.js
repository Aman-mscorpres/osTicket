// Function to handle all types of errors
function errorHandler(err, req, res, next) {
  // Default error response
  let statusCode = 500;
  let responseData = {
    success: false,
    error: err.message,
    message: "Internal Server Error",
  };

  // Handle different error types using switch case
  switch (err.name) {
    case "ValidationError":
      statusCode = 403;
      responseData = {
        error: err.errors.map((error) => error.message),
        message: "Validation Error",
      };
      break;
    case "SequelizeUniqueConstraintError":
      statusCode = 403;
      responseData = {
        error: err.errors.map((error) => {
          return { msg: error.message };
        }),
        message: "Unique Constraint Error",
      };
      break;
    case "UnauthorizedError":
      statusCode = 401;
      responseData = {
        error: err.message,
        message: "Unauthorized",
      };
      break;
    case "NotFoundError":
      statusCode = 404;
      responseData = {
        error: err.message,
        message: "Not Found",
      };
      break;
    case "MulterError":
      statusCode = 403;
      responseData = {
        error: "MulterError",
        message: err.message,
      };
      break;
    case "JsonWebTokenError":
      statusCode = 401;
      responseData = {
        error: "Invalid Token",
        message: err.message,
      };
      break;
    case "TokenExpiredError":
      statusCode = 401;
      responseData = {
        error: err.message,
        message: "Token Expired",
      };
      break;
    default:
      break;
  }
  responseData.success = false;
  responseData.stack = err.stack;
  // Log the error for debugging purposes
  console.error(err);

  // Send the response
  return res.status(statusCode).json(responseData);
}

module.exports = errorHandler;
