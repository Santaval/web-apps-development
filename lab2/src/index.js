import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import multer from "multer";
import { PORT } from "./utils/env/envVariables.js";
import morgan from "morgan";

// ===================  Routes import ===================
import studentsRouter from "./routes/students.routes.js";

const app = express();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STATIC_DIR = path.join(__dirname, "views");

// ==================== MIDDLEWARES ====================
app.use(multer().any()); // Handle multipart/form-data
app.use(express.static(STATIC_DIR)); // Serve static files
app.use(bodyParser.json()); // Parse application/json
app.use(bodyParser.urlencoded({ extended: true })); // Parse application/x-www-form-urlencoded
app.use(morgan('dev')); // Log HTTP requests


// ==================== ROUTES ====================
app.use("/students", studentsRouter);


// ==================== START SERVER ====================
app.listen(PORT, function () {
  console.log("Corriendo en http://localhost:" + PORT);
});
