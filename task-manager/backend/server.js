require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const auth = require("./middleware/auth");


const app = express();

// connect database
connectDB();

// middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));



// test route
app.get("/", (req, res) => {
  res.send("API running");
});
app.get("/api/protected", auth, (req, res) => {
  res.json({
    message: "Protected route success",
    userId: req.userId
  });
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log("✅ Server running on port " + PORT);
});
