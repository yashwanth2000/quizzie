import Quiz from "../models/quiz.model.js";
import validateQuiz from "../utils/quizValidation.js";
import errorHandler from "../utils/error.js";
import { v4 as uuidv4 } from "uuid";

const createQuiz = async (req, res, next) => {
  const { quizName, quizType, numQuestions, questions, timer } = req.body;

  const { isValid, message } = validateQuiz({
    quizName,
    quizType,
    numQuestions,
    questions,
    timer,
  });
  if (!isValid) {
    return next(errorHandler(400, message));
  }

  try {
    const quizCode = uuidv4();
    const newQuiz = new Quiz({
      quizName,
      quizType,
      numQuestions,
      questions: questions.map(
        ({ questionText, optionType, options, correctAnswerIndex }) => ({
          questionText,
          optionType,
          options: options.map(({ text, imageUrl }) => ({
            text,
            imageUrl,
          })),
          correctAnswerIndex,
        })
      ),
      timer,
      quizCode,
    });
    const savedQuiz = await newQuiz.save();
    res
      .status(201)
      .json({ message: "Quiz created successfully", quiz: savedQuiz });
  } catch (error) {
    next(errorHandler(500, "Internal Server Error"));
  }
};

const getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.findById(req.params.id);
    if (!quizzes) {
      return next(errorHandler(404, "Quiz not found"));
    }
    res.status(200).json(quizzes);
  } catch (error) {
    next(errorHandler(500, "Internal Server Error"));
  }
};

const getAllQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find();
    if (!quizzes) {
      return next(errorHandler(404, "Quiz not found"));
    }
    res.status(200).json(quizzes);
  } catch (error) {
    next(errorHandler(500, "Internal Server Error"));
  }
};

const getQuizByCode = async (req, res, next) => {
  try {
    const quizCode = req.params.quizCode;

    const quiz = await Quiz.findOne({ quizCode });

    if (!quiz) {
      return next(errorHandler(404, "Quiz not found"));
    }

    res.status(200).json(quiz);
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

const deleteQuiz = async (req, res, next) => {
  try {
    const deletedQuiz = await Quiz.findById(req.params.id);

    if (!deletedQuiz) {
      return next(errorHandler(404, "Quiz not found"));
    }

    await Quiz.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    next(errorHandler(500, "Internal Server Error"));
  }
};

const updateQuiz = async (req, res, next) => {
  const quizId = req.params.id;
  const { numQuestions, questions, timer } = req.body;

  if (
    numQuestions === undefined &&
    questions === undefined &&
    timer === undefined
  ) {
    return next(
      errorHandler(
        400,
        "At least one field (numQuestions, questions, timer) must be provided for update."
      )
    );
  }

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return next(errorHandler(404, "Quiz not found"));
    }

    if (numQuestions !== undefined) {
      quiz.numQuestions = numQuestions;
    }
    if (timer !== undefined) {
      quiz.timer = timer;
    }
    if (questions !== undefined && Array.isArray(questions)) {
      quiz.questions = questions.map(
        ({ questionText, optionType, options, correctAnswerIndex }) => ({
          questionText,
          optionType,
          options: options.map(({ text, imageUrl }) => ({
            text,
            imageUrl,
          })),
          correctAnswerIndex,
        })
      );
    }

    const updatedQuiz = await quiz.save();

    res.status(200).json({
      message: "Quiz updated successfully",
      quiz: updatedQuiz,
    });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

const updateQuizAnalytics = async (req, res, next) => {
  try {
    const quizCode = req.params.quizCode;
    const quiz = await Quiz.findOne({ quizCode });

    if (!quiz) {
      return next(errorHandler(404, "Quiz not found"));
    }

    const { questionIndex, isCorrect, impressions } = req.body;

    let update = {};

    if (impressions !== undefined) {
      update.$inc = { 'analytics.impressions': 1 };
    } else if (questionIndex !== undefined && isCorrect !== undefined) {
      update.$inc = {
        [`questions.${questionIndex}.totalAttempts`]: 1,
        [`questions.${questionIndex}.${isCorrect ? 'totalCorrect' : 'totalIncorrect'}`]: 1,
      };
    } else {
      return next(errorHandler(400, "Invalid analytics data"));
    }

    const updatedQuiz = await Quiz.findOneAndUpdate({ quizCode }, update, {
      new: true,
    });

    res.status(200).json({
      message: "Quiz analytics updated successfully",
      quiz: updatedQuiz,
    });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

export {
  createQuiz,
  getQuizzes,
  deleteQuiz,
  updateQuiz,
  getAllQuizzes,
  getQuizByCode,
  updateQuizAnalytics,
};
