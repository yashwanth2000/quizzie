const validatePoll = (pollData) => {
  const { quizName, quizType, numQuestions, questions } = pollData;

  if (!quizName || !quizType || !numQuestions || !questions) {
    return { isValid: false, message: "All fields are required" };
  }

  if (typeof quizName !== "string") {
    return { isValid: false, message: "Quiz name must be a string" };
  }
  if (typeof quizType !== "string") {
    return { isValid: false, message: "Quiz type must be a string" };
  }
  if (typeof numQuestions !== "number" || numQuestions <= 0) {
    return {
      isValid: false,
      message: "Number of questions must be a positive number",
    };
  }
  if (!Array.isArray(questions) || questions.length !== numQuestions) {
    return {
      isValid: false,
      message:
        "Questions must be an array with the length equal to numQuestions",
    };
  }

  for (const question of questions) {
    const { questionText, optionType, options } = question;
    if (!questionText || !optionType || !options) {
      return {
        isValid: false,
        message: "Each question must have questionText, optionType, options",
      };
    }
    if (typeof questionText !== "string") {
      return { isValid: false, message: "Question text must be a string" };
    }
    if (typeof optionType !== "string") {
      return { isValid: false, message: "Option type must be a string" };
    }
    if (!Array.isArray(options) || options.length < 2) {
      return {
        isValid: false,
        message: "Options must be an array with at least two options",
      };
    }
  }
  return { isValid: true };
};

export default validatePoll;
