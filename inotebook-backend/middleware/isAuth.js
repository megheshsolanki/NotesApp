const jwt = require("jsonwebtoken");
const JWT_SIGNATURE = "somesupersecretstring";

const isAuth = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).json({ message: "Not Authorized!" });
  }
  try {
    const decodedToken = jwt.verify(token, JWT_SIGNATURE);
    req.user = decodedToken.user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not Authorized!" });
  }
};

module.exports = isAuth;
