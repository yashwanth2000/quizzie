import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import quizRouter from "./routes/quiz.route.js";
import pollRouter from "./routes/poll.route.js";
import path from "path";
import fs from "fs";

dotenv.config();

const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB");
    console.error(err);
  });

app.use("/auth", authRouter);
app.use("/quiz", quizRouter);
app.use("/poll", pollRouter);

const frontEndPath = path.join(__dirname, "../front-end/dist");
if (fs.existsSync(frontEndPath)) {
  console.log(`Serving static files from ${frontEndPath}`);
} else {
  console.error(`Static files directory ${frontEndPath} does not exist`);
}

app.use(express.static(frontEndPath));
app.get("*", (req, res) => {
  const indexPath = path.join(frontEndPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.error(`Index file ${indexPath} does not exist`);
    res.status(404).send("Index file not found");
  }
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  return res.status(statusCode).json({ success: false, statusCode, message });
});
