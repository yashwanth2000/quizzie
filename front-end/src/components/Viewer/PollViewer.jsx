import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPollByCode, updatePollAnalytics } from "../../utils/pollAPI";
import styles from "./PollViewer.module.css";

export default function QuizViewer() {
  const { pollCode } = useParams();

  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const fetchPollData = async () => {
      try {
        const data = await getPollByCode(pollCode);
        setQuizData(data);
        setSelectedOptions(new Array(data.numQuestions).fill(null));
        await updatePollAnalytics(pollCode, { impressions: 1 });
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    fetchPollData();
  }, [pollCode]);

  if (!quizData) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const { numQuestions, questions } = quizData;
  const currentQuestion = questions[currentQuestionIndex];
  const { questionText, options } = currentQuestion;

  const handleNextQuestion = () => {
    if (currentQuestionIndex < numQuestions - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleOptionSelect = (index) => {
    setSelectedOptions((prevOptions) => {
      const updatedOptions = [...prevOptions];
      updatedOptions[currentQuestionIndex] = index;
      return updatedOptions;
    });
  };

  const handleSubmitQuiz = async () => {
  if (selectedOptions === null) return;

  const optionUpdates = selectedOptions.map((optionIndex, questionIndex) => ({
    questionIndex,
    optionIndex
  }));

  try {
    await updatePollAnalytics(pollCode, { optionUpdates });
  } catch (error) {
    console.error("Error submitting poll:", error);
    throw error;
  }

  setQuizCompleted(true);
};


  const renderOptionCard = (option, index) => {
    const isSelected = selectedOptions[currentQuestionIndex] === index;
    const cardClassName = `${styles.optionCard} ${
      isSelected ? styles.selected : ""
    }`;
    let optionContent = null;

    if (currentQuestion.optionType === "Text") {
      optionContent = <p className={styles.optionText}>{option.text}</p>;
    } else if (currentQuestion.optionType === "Image URL") {
      optionContent = (
        <img
          src={option.imageUrl}
          alt={`Option ${index}`}
          className={styles.optionImageUrl}
        />
      );
    } else if (currentQuestion.optionType === "Text & Image URL") {
      optionContent = (
        <div>
          <p className={styles.optionText}>{option.text}</p>
          <img
            src={option.imageUrl}
            alt={`Option ${index}`}
            className={styles.optionImage}
          />
        </div>
      );
    }

    return (
      <div
        key={index}
        className={`${cardClassName} ${
          currentQuestion.optionType === "Image URL" ? styles.imageOption : ""
        }`}
        onClick={() => handleOptionSelect(index)}
      >
        {optionContent}
      </div>
    );
  };

  return (
    <div className={styles.quizContainer}>
      {quizCompleted ? (
        <div className={styles.completedScreen}>
          <h1>Thank you for participating in the Poll</h1>
        </div>
      ) : (
        <>
          <div className={styles.quizHeader}>
            <div className={styles.quizProgress}>
              {currentQuestionIndex + 1} / {numQuestions}
            </div>
          </div>
          <div className={styles.quizContent}>
            <div className={styles.quizQuestion}>
              <p className={styles.questionText}>{questionText}</p>
              <div className={styles.optionContainer}>
                <div className={styles.optionRow}>
                  {options
                    .slice(0, 2)
                    .map((option, index) => renderOptionCard(option, index))}
                </div>
                <div className={styles.optionRow}>
                  {options
                    .slice(2)
                    .map((option, index) =>
                      renderOptionCard(option, index + 2)
                    )}
                </div>
              </div>
            </div>
            <div className={styles.quizNavigation}>
              {currentQuestionIndex < numQuestions - 1 ? (
                <button
                  className={`${styles.navButton} ${styles.nextButton}`}
                  onClick={handleNextQuestion}
                >
                  Next
                </button>
              ) : (
                <button
                  className={`${styles.navButton} ${styles.submitButton}`}
                  onClick={handleSubmitQuiz}
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
