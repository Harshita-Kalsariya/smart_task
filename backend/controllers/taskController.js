// controllers/taskController.js - CRUD logic for Tasks

const Task = require('../models/Task');

/**
 * @desc    Get all tasks for the logged-in user
 * @route   GET /api/tasks
 * @access  Private
 */
const getTasks = async (req, res, next) => {
  try {
    // Support filtering by status via query param: ?status=pending
    const filter = { userId: req.user._id };
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title) {
      res.status(400);
      throw new Error('Task title is required');
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      userId: req.user._id, // Associate task with logged-in user
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Ensure the task belongs to the requesting user
    if (task.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this task');
    }

    const { title, description, status, priority, dueDate } = req.body;

    // Apply updates
    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;
    task.priority = priority ?? task.priority;
    task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Ensure the task belongs to the requesting user
    if (task.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this task');
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully', id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
