import Poll from "../models/poll.model.js";
import errorHandler from "../utils/error.js";
import validatePoll from "../utils/pollValidation.js";
import { v4 as uuidv4 } from "uuid";

const createPoll = async (req, res, next) => {
  const { quizName, quizType, numQuestions, questions } = req.body;

  const { isValid, message } = validatePoll({
    quizName,
    quizType,
    numQuestions,
    questions,
  });
  if (!isValid) {
    return next(errorHandler(400, message));
  }

  try {
    const pollCode = uuidv4();

    const newPoll = new Poll({
      quizName,
      quizType,
      numQuestions,
      questions: questions.map(({ questionText, optionType, options }) => ({
        questionText,
        optionType,
        options: options.map(({ text, imageUrl }) => ({
          text,
          imageUrl,
        })),
      })),
      pollCode,
    });

    const savedPoll = await newPoll.save();
    res
      .status(201)
      .json({ message: "Poll created successfully", poll: savedPoll });
  } catch (error) {
    next(errorHandler(500, "Internal Server Error"));
  }
};

const getPoll = async (req, res, next) => {
  try {
    const polls = await Poll.findById(req.params.id);
    if (!polls) {
      return next(errorHandler(404, "Poll not found"));
    }
    res.status(200).json(polls);
  } catch (error) {
    next(errorHandler(500, "Internal Server Error"));
  }
};

const getAllPolls = async (req, res, next) => {
  try {
    const polls = await Poll.find();
    if (!polls) {
      return next(errorHandler(404, "Poll not found"));
    }
    res.status(200).json(polls);
  } catch (error) {
    next(errorHandler(500, "Internal Server Error"));
  }
};

const getPollByCode = async (req, res, next) => {
  try {
    const pollCode = req.params.pollCode;
    const poll = await Poll.findOne({ pollCode });

    if (!poll) {
      return next(errorHandler(404, "Poll not found"));
    }

    res.status(200).json(poll);
  } catch (error) {
    console.log(error);

    next(errorHandler(500, "Internal Server Error"));
  }
};

const deletePoll = async (req, res, next) => {
  try {
    const deletedPoll = await Poll.findById(req.params.id);
    if (!deletedPoll) {
      return next(errorHandler(404, "Poll not found"));
    }
    await Poll.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Poll deleted successfully" });
  } catch (error) {
    next(errorHandler(500, "Internal Server Error"));
  }
};

const updatePoll = async (req, res, next) => {
  const pollId = req.params.id;
  const { numQuestions, questions } = req.body;

  if (numQuestions === undefined && questions === undefined) {
    return next(
      errorHandler(
        400,
        "At least one field (numQuestions, questions, timer) must be provided for update."
      )
    );
  }

  try {
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return next(errorHandler(404, "Poll not found"));
    }

    if (numQuestions !== undefined) {
      poll.numQuestions = numQuestions;
    }

    if (questions !== undefined && Array.isArray(questions)) {
      poll.questions = questions.map(
        ({ questionText, optionType, options }) => ({
          questionText,
          optionType,
          options: options.map(({ text, imageUrl }) => ({
            text,
            imageUrl,
          })),
        })
      );
    }

    const updatedPoll = await poll.save();
    res
      .status(200)
      .json({ message: "Poll updated successfully", poll: updatedPoll });
  } catch (error) {
    next(errorHandler(500, "Internal Server Error"));
  }
};

const updatePollAnalytics = async (req, res, next) => {
  try {
    const pollCode = req.params.pollCode;
    const poll = await Poll.findOne({ pollCode });

    if (!poll) {
      return next(errorHandler(404, "Poll not found"));
    }

    const { impressions, optionUpdates } = req.body;

    const update = {};
    if (impressions) {
      update.$inc = { "analytics.impressions": impressions };
    }

    if (optionUpdates && Array.isArray(optionUpdates)) {
      optionUpdates.forEach(({ questionIndex, optionIndex }) => {
        if (!update.$inc) {
          update.$inc = {};
        }
        update.$inc[`questions.${questionIndex}.optionCounts.${optionIndex}`] = 1;
      });
    }

    const updatedPoll = await Poll.findOneAndUpdate({ pollCode }, update, {
      new: true,
    });

    res.status(200).json({
      message: "Poll analytics updated successfully",
      analytics: updatedPoll,
    });
  } catch (error) {
    next(errorHandler(500, "Internal Server Error"));
  }
};


export {
  createPoll,
  getPoll,
  deletePoll,
  updatePoll,
  getAllPolls,
  getPollByCode,
  updatePollAnalytics,
};
