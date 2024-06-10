import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./UpdateQuizModal.module.css";
import deleteIcon from "../../../assets/delete.png";
import plusIcon from "../../../assets/plus.png";
import { updateQuiz, getQuizById } from "../../../utils/quizAPI";

const UpdateQuizModal = ({ isOpen, onClose, quizId, onSuccess }) => {
  const [questions, setQuestions] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [numQuestions, setNumQuestions] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [timer, setTimer] = useState(0);
  const [consistentTimer, setConsistentTimer] = useState(true);

  useEffect(() => {
    const fetchQuizData = async () => {
      if (isOpen && quizId) {
        try {
          setIsLoading(true);
          const data = await getQuizById(quizId);
          setQuestions(data.questions);
          setNumQuestions(data.questions.length);
          setTimer(data.timer);
          setIsLoading(false);
        } catch (error) {
          console.error("Failed to fetch quiz data:", error);
          setErrorMessage("Failed to load quiz data. Please try again.");
          setIsLoading(false);
        }
      }
    };
    fetchQuizData();
  }, [isOpen, quizId]);

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className={styles.modalBackdrop}>
        <div className={styles.modalContent}>
          <p>Loading quiz data...</p>
        </div>
      </div>
    );
  }

  const updateQuestion = (index, updatedQuestion) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...updatedQuestion };
    setQuestions(newQuestions);
    setErrorMessage("");
  };

  const handleOptionChange = (optionIndex, field, value) => {
    const newOptions = questions[activeQuestionIndex].options.map(
      (option, idx) =>
        idx === optionIndex ? { ...option, [field]: value } : option
    );
    updateQuestion(activeQuestionIndex, { options: newOptions });
  };

  const handleAddQuestion = () => {
    if (numQuestions < 5) {
      const defaultOptionType = questions[0]?.optionType || "Text";
      setQuestions([
        ...questions,
        {
          questionText: "",
          options: [
            { text: "", imageUrl: "" },
            { text: "", imageUrl: "" },
          ],
          optionType: defaultOptionType,
        },
      ]);
      setNumQuestions(numQuestions + 1);
    }
  };

  const handleDeleteQuestion = (index) => {
    if (numQuestions > 1) {
      const newQuestions = questions.filter((_, idx) => idx !== index);
      setQuestions(newQuestions);
      setNumQuestions(numQuestions - 1);
      if (activeQuestionIndex >= index) {
        setActiveQuestionIndex((prev) => (prev > 0 ? prev - 1 : 0));
      }
    }
  };

  const handleCorrectAnswerChange = (index) => {
    updateQuestion(activeQuestionIndex, { correctAnswerIndex: index });
  };

  const handleAddOption = () => {
    if (questions[activeQuestionIndex].options.length < 4) {
      const newOptions = [
        ...questions[activeQuestionIndex].options,
        { text: "", imageUrl: "" },
      ];
      updateQuestion(activeQuestionIndex, { options: newOptions });
    }
  };

  const handleDeleteOption = (index) => {
    if (questions[activeQuestionIndex].options.length > 2) {
      const newOptions = questions[activeQuestionIndex].options.filter(
        (_, idx) => idx !== index
      );
      updateQuestion(activeQuestionIndex, { options: newOptions });
    }
  };

  const handleOptionTypeChange = (optionType) => {
    const newOptions = questions[activeQuestionIndex].options.map(() => ({
      text: "",
      imageUrl: "",
    }));
    updateQuestion(activeQuestionIndex, { optionType, options: newOptions });
  };

  const handleTimerChange = (time) => {
    const updatedQuestions = questions.map((q) => ({ ...q, timer: time }));
    setQuestions(updatedQuestions);
    setTimer(time);
    setConsistentTimer(true);
  };

  const handleUpdateQuiz = async (e) => {
    e.preventDefault();

    if (!consistentTimer) {
      setErrorMessage("Timer should be the same for all questions.");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const { questionText, options, optionType } = questions[i];
      if (!questionText.trim()) {
        setErrorMessage(`Quiz question ${i + 1} is required.`);
        return;
      }
      for (let j = 0; j < options.length; j++) {
        const { text, imageUrl } = options[j];
        if (optionType !== "Image URL" && !text.trim()) {
          setErrorMessage("All text options must be filled out.");
          return;
        }
        if (optionType !== "Text" && !imageUrl.trim()) {
          setErrorMessage("All image URLs must be filled out.");
          return;
        }
      }
      if (optionType !== questions[0].optionType) {
        setErrorMessage("Option type should be the same for all questions.");
        return;
      }
      if (options.length !== questions[0].options.length) {
        setErrorMessage(
          "Number of options should be the same for all questions."
        );
        return;
      }
    }

    setErrorMessage("");

    const quizData = {
      numQuestions,
      timer,
      questions: questions.map(({ options, optionType, ...rest }) => ({
        ...rest,
        optionType,
        options: options.map((option) => ({
          ...(optionType !== "Image URL" && { text: option.text }),
          ...(optionType !== "Text" && { imageUrl: option.imageUrl }),
        })),
      })),
    };

    try {
      const updatedQuiz = await updateQuiz(quizId, quizData);
      onSuccess(updatedQuiz);
    } catch (error) {
      console.error("Error updating quiz:", error);
      setErrorMessage("An error occurred while updating the quiz.");
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <form onSubmit={handleUpdateQuiz}>
          <div className={styles.header}>
            {[...Array(numQuestions)].map((_, index) => (
              <span
                key={index}
                className={styles.roundNumber}
                onClick={() => setActiveQuestionIndex(index)}
                style={{
                  backgroundColor:
                    activeQuestionIndex === index ? "#60b84b" : "#ffffff",
                  color: activeQuestionIndex === index ? "#ffffff" : "#474444",
                }}
              >
                {index + 1}
                {index >= 1 && (
                  <span
                    className={styles.cancelIcon}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteQuestion(index);
                    }}
                  >
                    ×
                  </span>
                )}
              </span>
            ))}
            {numQuestions < 5 && (
              <span onClick={handleAddQuestion} className={styles.plusIcon}>
                <img src={plusIcon} alt="PlusIcon" />
              </span>
            )}
            <span className={styles.maxQuestionsText}>Max 5 questions</span>
          </div>
          <div className={styles.quizQuestion}>
            <input
              type="text"
              placeholder="Quiz Question"
              value={questions[activeQuestionIndex].questionText}
              onChange={(e) =>
                updateQuestion(activeQuestionIndex, {
                  questionText: e.target.value,
                })
              }
            />
          </div>
          <div className={styles.optionType}>
            <span>Option Type</span>
            <div className={styles.optionTypeContainer}>
              {["Text", "Image URL", "Text & Image URL"].map((type) => (
                <label key={type} className={styles.optionTypeLabel}>
                  <input
                    type="radio"
                    name="optionType"
                    checked={questions[activeQuestionIndex].optionType === type}
                    onChange={() => handleOptionTypeChange(type)}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
          <div className={styles.options}>
            {questions[activeQuestionIndex].options.map((option, index) => (
              <div key={index} className={styles.option}>
                <div className={styles.optionInputContainer}>
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={
                      questions[activeQuestionIndex].correctAnswerIndex ===
                      index
                    }
                    onChange={() => handleCorrectAnswerChange(index)}
                  />
                  {questions[activeQuestionIndex].optionType !==
                    "Image URL" && (
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) =>
                        handleOptionChange(index, "text", e.target.value)
                      }
                      placeholder="Text"
                      className={styles.optionInput}
                    />
                  )}
                  {questions[activeQuestionIndex].optionType !== "Text" && (
                    <input
                      type="url"
                      placeholder="Image URL"
                      value={option.imageUrl}
                      onChange={(e) =>
                        handleOptionChange(index, "imageUrl", e.target.value)
                      }
                      className={styles.optionInput}
                    />
                  )}
                </div>
                {index > 1 && (
                  <img
                    src={deleteIcon}
                    alt="Delete"
                    className={styles.deleteIcon}
                    onClick={() => handleDeleteOption(index)}
                  />
                )}
              </div>
            ))}
          </div>

          <div className={styles.timerAndAddOptionContainer}>
            <div className={styles.addOptionButtonContainer}>
              <button
                type="button"
                onClick={handleAddOption}
                className={styles.addOptionButton}
              >
                Add Option
              </button>
            </div>
            <div className={styles.timer}>
              <span>Timer</span>
              {[0, 5, 10].map((time) => (
                <button
                  key={time}
                  type="button"
                  className={`${styles.timerButton} ${
                    timer === time ? styles.active : ""
                  }`}
                  onClick={() => handleTimerChange(time)}
                >
                  {time === 0 ? "Off" : `${time} sec`}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className={styles.createQuizButton}>
              Update Quiz
            </button>
          </div>

          {errorMessage && (
            <div className={styles.errorMessage}>{errorMessage}</div>
          )}
        </form>
      </div>
    </div>
  );
};

UpdateQuizModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  quizId: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default UpdateQuizModal;
