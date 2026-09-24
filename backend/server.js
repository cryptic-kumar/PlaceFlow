require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const driveRoutes = require("./routes/driveRoutes");
const studentRoutes = require("./routes/studentRoutes");
const tnpRoutes = require("./routes/tnpRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.MONGODB_URI || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) =>
  res.json({ status: "ok", service: "placeflow-backend" }),
);

app.use("/api/auth", authRoutes);
app.use("/api/drives", driveRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/tnp", tnpRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found." }));

app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal server error." });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`[server] PlaceFlow backend running on port ${PORT}`),
  );
});

module.exports = app;
