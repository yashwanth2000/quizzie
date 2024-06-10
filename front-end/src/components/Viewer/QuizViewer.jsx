import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getQuizByCode, updateQuizAnalytics } from "../../utils/quizAPI";
import styles from "./QuizViewer.module.css";
import trophyImg from "../../assets/trophy.png";

export default function QuizViewer() {
  const { quizCode } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [hasTimer, setHasTimer] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const data = await getQuizByCode(quizCode);
        setQuizData(data);
        setSelectedOptions(new Array(data.numQuestions).fill(null));
        await updateQuizAnalytics(quizCode, { impressions: 1 });
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    fetchQuizData();
  }, [quizCode]);

  useEffect(() => {
    if (!quizData || quizCompleted) return;

    const { timer } = quizData;
    const shouldHaveTimer = timer > 0;
    setHasTimer(shouldHaveTimer);

    if (shouldHaveTimer) {
      setTimeLeft(timer);
      const timerInterval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime > 0) return prevTime - 1;
          if (prevTime === 0 && shouldHaveTimer) {
            handleNextQuestion();
          }
          return 0;
        });
      }, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [quizData, currentQuestionIndex, quizCompleted]);

  if (!quizData) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const { numQuestions, questions } = quizData;
  const currentQuestion = questions[currentQuestionIndex];
  const { questionText, options } = currentQuestion;

  const handleNextQuestion = async () => {
    const userAnswer = selectedOptions[currentQuestionIndex];
    const correctAnswer = currentQuestion.correctAnswerIndex;
    const isCorrect = userAnswer === correctAnswer;

    if (isCorrect) setScore(score + 1);

    await updateQuizAnalytics(quizCode, {
      questionIndex: currentQuestionIndex,
      isCorrect,
    });

    if (currentQuestionIndex < numQuestions - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);

      const nextQuestionTimer = quizData.questions[nextIndex].timer || 0;
      setTimeLeft(nextQuestionTimer);
      setHasTimer(nextQuestionTimer > 0);
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
    const userAnswer = selectedOptions[currentQuestionIndex];
    const correctAnswer = currentQuestion.correctAnswerIndex;
    const isCorrect = userAnswer === correctAnswer;

    if (isCorrect) setScore(score + 1);

    await updateQuizAnalytics(quizCode, {
      questionIndex: currentQuestionIndex,
      isCorrect,
    });

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

  const QuizCompletedScreen = () => (
    <div className={styles.completedScreen}>
      <h1>Congrats Quiz is completed</h1>
      <img src={trophyImg} alt="Trophy" className={styles.trophyImage} />
      <p className={styles.scoreText}>
        Your score is: <span className={styles.score}>{score}</span> /{" "}
        {numQuestions}
      </p>
    </div>
  );

  return (
    <div className={styles.quizContainer}>
      {quizCompleted ? (
        <QuizCompletedScreen />
      ) : (
        <>
          <div className={styles.quizHeader}>
            <div className={styles.quizProgress}>
              {currentQuestionIndex + 1} / {numQuestions}
            </div>
            {hasTimer && timeLeft > 0 && (
              <div className={styles.quizTimer}>
                00:{timeLeft.toString().padStart(2, "0")}
              </div>
            )}
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
