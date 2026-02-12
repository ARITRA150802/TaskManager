const Task = require("../models/Task");


// =====================
// GET TASKS (pagination + filters)
// =====================
exports.getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";
    const status = req.query.status || "all";
    const sort = req.query.sort || "createdAt_desc";

    const query = { user: req.user.id };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (status === "completed") query.completed = true;
    if (status === "pending") query.completed = false;

    const sortMap = {
      createdAt_desc: { createdAt: -1 },
      createdAt_asc: { createdAt: 1 },
      title_asc: { title: 1 },
      title_desc: { title: -1 }
    };

    const total = await Task.countDocuments(query);

    const tasks = await Task.find(query)
      .sort(sortMap[sort])
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      tasks,
      total,
      page,
      pages: Math.ceil(total / limit)
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// =====================
// CREATE TASK
// =====================
exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      title,
      description,
      user: req.user.id
    });

    res.status(201).json(task);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// =====================
// UPDATE TASK
// =====================
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// =====================
// DELETE TASK
// =====================
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
