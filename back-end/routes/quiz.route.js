import express from "express";
import {
  createQuiz,
  getQuizzes,
  deleteQuiz,
  updateQuiz,
  getAllQuizzes,
  getQuizByCode,
  updateQuizAnalytics,
} from "../controller/quiz.controller.js";
import verifyToken from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create-quiz", verifyToken, createQuiz);
router.get("/get/:id", verifyToken, getQuizzes);
router.get("/get-all", verifyToken, getAllQuizzes);
router.get("/code/:quizCode", getQuizByCode);
router.delete("/delete/:id", verifyToken, deleteQuiz);
router.patch("/update/:id", verifyToken, updateQuiz);
router.patch("/analytics/:quizCode", updateQuizAnalytics);

export default router;
