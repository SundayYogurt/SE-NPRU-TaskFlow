const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controller/task.controller");

const protect = require("../middleware/authJwt.middleware");
const { allowTaskOwner } = require("../middleware/permission.middleware");

//login required
router.post("/", protect, createTask);
router.get("/", protect, getTasks);
router.get("/:id", protect, getTaskById);

//owner
router.put("/:id", protect, allowTaskOwner, updateTask);
router.delete("/:id", protect, allowTaskOwner, deleteTask);

module.exports = router;