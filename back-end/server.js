import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import quizRouter from "./routes/quiz.route.js";
import pollRouter from "./routes/poll.route.js";
import path from "path";

dotenv.config();

const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cookieParser());

console.log("CLIENT_URL:", process.env.CLIENT_URL);

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

app.use("/auth", (req, res, next) => {
  console.log("Auth route hit:", req.originalUrl); 
  authRouter(req, res, next);
});

app.use("/quiz", (req, res, next) => {
  console.log("Quiz route hit:", req.originalUrl); 
  quizRouter(req, res, next);
});

app.use("/poll", (req, res, next) => {
  console.log("Poll route hit:", req.originalUrl);
  pollRouter(req, res, next);
});


const frontEndPath = path.join(__dirname, "../front-end/dist");
console.log("Front-end path:", frontEndPath); 

app.use(express.static(frontEndPath));


app.get("*", (req, res) => {
  console.log("Request URL:", req.originalUrl); 

  if (
    req.originalUrl.startsWith("/auth") ||
    req.originalUrl.startsWith("/quiz") ||
    req.originalUrl.startsWith("/poll")
  ) {
    console.log("API Route Not Found");
    return res.status(404).send("API Route Not Found");
  }

  console.log("Serving index.html"); 
  res.sendFile(path.join(frontEndPath, "index.html"));
});


app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  return res.status(statusCode).json({ success: false, statusCode, message });
});
