const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SIGNATURE = "somesupersecretstring";
const isAuth = require("../middleware/isAuth");

// /api/auth/signUp
router.post(
  "/signUp",
  [
    body("name", "Name must be atleast 3 characters").isLength(3),
    body("email", "Please enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength(5),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success,message: "User with this email already exists." });
      }
      const hashPass = await bcrypt.hash(req.body.password, 10);
      user = await User.create({
        name: req.body.name,
        password: hashPass,
        email: req.body.email,
      });
      const authData = {
        user: {
          id: user._id,
        },
      };
      const authToken = jwt.sign(authData, JWT_SIGNATURE);
      success = true
      res.status(200).json({success, authToken });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ error: err.message });
    }
  }
);

// /api/auth/login
router.post(
  "/login",
  [
    body("email", "Please enter a valid email").isEmail(),
    body("password", "Password field cannot be empty").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email: email });
      if (!user) {
        success = false
        return res
          .status(400)
          .json({ success,error: "Please try to login with correct credentials" });
      }

      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        success=false
        return res
          .status(400)
          .json({ success,error: "Please try to login with correct credentials" });
      }

      const authData = {
        user: {
          id: user._id,
        },
      };
      const authToken = await jwt.sign(authData, JWT_SIGNATURE);
      success = true
      res.status(200).json({ success,authToken });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ error: err.message });
    }
  }
);

// /api/auth/getUser                Login Required
router.post("/getUser", isAuth, async (req, res) => {
  try {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
		res.status(200).json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
