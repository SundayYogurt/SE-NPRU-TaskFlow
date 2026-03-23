const TaskModel = require("../models/task.model");

const createTask = async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;

    // validate
    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const task = await TaskModel.create({
      title,
      description,
      status,
      priority,
      user: req.user.id, // 🔥 ผูกกับ user
    });

    return res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (err) {
    console.error("createTask error:", err);

    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    // filter optional
    const { status, priority } = req.query;

    const filter = { user: userId };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await TaskModel.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      count: tasks.length,
      tasks,
    });
  } catch (err) {
    console.error("getTasks error:", err);

    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await TaskModel.findById(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // 🔐 กันดูของคนอื่น
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    return res.status(200).json({ task });
  } catch (err) {
    console.error("getTaskById error:", err);

    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;

    const updateData = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "No data provided",
      });
    }

    const task = await TaskModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      message: "Task updated",
      task,
    });
  } catch (err) {
    console.error("updateTask error:", err);

    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await TaskModel.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (err) {
    console.error("deleteTask error:", err);

    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};