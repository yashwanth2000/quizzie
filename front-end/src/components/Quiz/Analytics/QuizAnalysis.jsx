import { useEffect, useState } from "react";
import styles from "./QuizAnalysis.module.css";
import NavBar from "../Navbar/NavBar.jsx";
import { useParams } from "react-router-dom";
import { getQuizById } from "../../../utils/quizAPI.js";

export default function QuizAnalysis() {
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState({});

  useEffect(() => {
    async function fetchData(quizId) {
      setQuizData(await getQuizById(quizId));
    }

    fetchData(quizId);
  }, [quizId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  if (!quizData.questions) return null;

  return (
    <>
      <NavBar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Quiz Question Analysis</h2>
          <div className={styles.headerInfo}>
            <p>Created On: {formatDate(quizData.createdAt)}</p>
            <p>Impressions: {quizData.analytics.impressions}</p>
          </div>
        </div>
        <div className={styles.content}>
          {quizData.questions.map((question, index) => (
            <div key={question._id} className={styles.questionContainer}>
              <p className={styles.question}>
                Q.{index + 1} {question.questionText}
              </p>
              <div className={styles.card}>
                <div className={styles.cardItem}>
                  <p className={styles.cardNumber}>{question.totalAttempts}</p>
                  <p className={styles.cardText}>
                    people Attempted the question
                  </p>
                </div>
                <div className={styles.cardItem}>
                  <p className={styles.cardNumber}>{question.totalCorrect}</p>
                  <p className={styles.cardText}>people Answered Correctly</p>
                </div>
                <div className={styles.cardItem}>
                  <p className={styles.cardNumber}>{question.totalIncorrect}</p>
                  <p className={styles.cardText}>people Answered Incorrectly</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
