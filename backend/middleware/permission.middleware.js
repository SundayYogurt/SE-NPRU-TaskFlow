const TaskModel = require("../models/task.model");

const allowTaskOwner = async (req, res, next) => {
  try {
    const { id: taskId } = req.params;
    const userId = req.user.id;

    const task = await TaskModel.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (task.user.toString() !== userId) {
      return res.status(403).json({
        message: "Forbidden: this is not your task",
      });
    }

    next();
  } catch (err) {
    console.error("allowTaskOwner error:", err);

    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

module.exports = {
  allowTaskOwner,
};