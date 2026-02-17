import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { connectToDatabase } from "./config/database";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Логирование всех запросов
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Статические файлы
app.use(express.static(path.join(__dirname, "../public")));

// Async function to start the server
const startServer = async () => {
  try {
    // Connect to the database FIRST
    await connectToDatabase();

    // Импортируем маршруты ПОСЛЕ подключения к БД
    const requestRoutes = (await import("./routes/requestRoutes")).default;
    const userRoutes = (await import("./routes/userRoutes")).default;
    const errorHandler = (await import("./middleware/errorHandler")).default;

    // Routes
    app.use("/api/requests", requestRoutes);
    app.use("/api/users", userRoutes);

    // Главная страница
    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "../public/index.html"));
    });

    // Error handling middleware (должен быть последним)
    app.use(errorHandler);

    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📋 API endpoints:`);
      console.log(`   GET  http://localhost:${PORT}/api/requests`);
      console.log(`   POST http://localhost:${PORT}/api/requests`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Start the application
startServer();
