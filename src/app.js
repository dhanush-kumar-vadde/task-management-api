const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./docs/swagger");

/* ROUTES */

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const projectRoutes = require("./routes/project.routes");
const taskRoutes = require("./routes/task.routes");
const messageRoutes = require("./routes/message.routes");
const notificationRoutes = require("./routes/notification.routes");
const adminRoutes = require("./routes/admin.routes");

/* MIDDLEWARES */

const rateLimiter = require("./middlewares/rateLimit.middleware");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

/* ---------------- GLOBAL MIDDLEWARES ---------------- */

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

/* ---------------- RATE LIMITING ---------------- */

app.use(rateLimiter);

/* ---------------- ROOT ---------------- */

app.get("/", (req, res) => {
  res.json({ message: "Task Management API running" });
});

/* ---------------- ROUTES ---------------- */

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/messages", messageRoutes);
app.use("/notifications", notificationRoutes);
app.use("/admin", adminRoutes);

/* ---------------- SWAGGER ---------------- */

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* ---------------- ERROR HANDLER ---------------- */

app.use(errorMiddleware);

module.exports = app;