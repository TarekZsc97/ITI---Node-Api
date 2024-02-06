const jwt = require("jsonwebtoken");

const VerifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization; // Typically 'authorization' is used
  if (authHeader && authHeader.startsWith("Bearer")) {
    const token = authHeader.split(" ");
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json("Token is invalid or expired"); // Return to prevent further execution
      }
      req.user = user;
      next();
    });
  } else {
    return res
      .status(401)
      .json("Authorization token is missing or not provided");
  }
};

const verifyTokenandAuthoraization = (req, res, next) => {
  VerifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("you are not allowed to do that");
    }
  });
};
const verifyTokenandAdmin = (req, res, next) => {
  VerifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("you are not allowed to do that");
    }
  });
};

module.exports = {
  VerifyToken,
  verifyTokenandAuthoraization,
  verifyTokenandAdmin,
};
