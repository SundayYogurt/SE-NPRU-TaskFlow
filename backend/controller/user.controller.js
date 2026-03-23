const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES || "1d";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
}

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // validate
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "username, email, password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // check duplicate
    const existingUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Username or email already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("register error:", err);

    if (err.code === 11000) {
      return res.status(400).json({
        message: "Duplicate field value",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "username and password are required",
      });
    }

    // login ได้ทั้ง username หรือ email
    const user = await UserModel.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      accessToken: token,
    });
  } catch (err) {
    console.error("login error:", err);

    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (err) {
    console.error("getMe error:", err);

    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔐 กันแก้ของคนอื่น
    if (req.user.id !== id) {
      return res.status(403).json({
        message: "You can only update your own profile",
      });
    }

    const { username, email } = req.body;

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "No data provided",
      });
    }

    const user = await UserModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Profile updated",
      user,
    });
  } catch (err) {
    console.error("updateProfile error:", err);

    if (err.code === 11000) {
      return res.status(400).json({
        message: "Username or email already exists",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
};