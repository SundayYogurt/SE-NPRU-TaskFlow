const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getMe,
  updateProfile,
} = require("../controller/user.controller");

const protect = require("../middleware/authJwt.middleware");

//public
router.post("/register", register);
router.post("/login", login);

//protect
router.get("/me", protect, getMe);
router.put("/:id", protect, updateProfile);


module.exports = router;