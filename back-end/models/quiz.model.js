import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    quizName: {
      type: String,
      required: true,
    },
    quizType: {
      type: String,
      required: true,
    },
    numQuestions: {
      type: Number,
      required: true,
    },
    questions: [
      {
        questionText: {
          type: String,
          required: true,
        },
        optionType: {
          type: String,
          required: true,
          enum: ["Text", "Image URL", "Text & Image URL"],
        },
        options: [
          {
            text: {
              type: String,
            },
            imageUrl: {
              type: String,
            },
          },
        ],
        correctAnswerIndex: {
          type: Number,
          required: true,
        },
        totalAttempts: {
          type: Number,
          default: 0,
        },
        totalCorrect: {
          type: Number,
          default: 0,
        },
        totalIncorrect: {
          type: Number,
          default: 0,
        },
      },
    ],
    timer: {
      type: Number,
      required: true,
    },
    quizCode: {
      type: String,
      required: true,
      unique: true,
    },
    analytics: {
      impressions: {
        type: Number,
        default: 0,
      }
    },
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
