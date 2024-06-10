import mongoose from "mongoose";
const pollSchema = new mongoose.Schema(
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
        optionCounts: {
          0: { type: Number, default: 0 },
          1: { type: Number, default: 0 },
          2: { type: Number, default: 0 },
          3: { type: Number, default: 0 }
        }
      },
    ],
    pollCode: {
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

const Poll = mongoose.model("Poll", pollSchema);
export default Poll;
