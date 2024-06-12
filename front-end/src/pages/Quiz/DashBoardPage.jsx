import { useState, useEffect } from "react";
import QuizStats from "../../components/Quiz/DashBoard/QuizStats";
import TrendingQuiz from "../../components/Quiz/DashBoard/TrendingQuiz";
import NavBar from "../../components/Quiz/Navbar/NavBar.jsx";
import styles from "./DashBoardPage.module.css";
import { getAllQuizzes } from "../../utils/quizAPI";
import { getAllPolls } from "../../utils/pollAPI";

export default function DashBoardPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quizzesData = await getAllQuizzes();
        const pollsData = await getAllPolls();

        const mergedItems = [...quizzesData, ...pollsData];
        setItems(mergedItems);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const totalQuizzes = items.length;
  const totalQuestions = items.reduce(
    (acc, item) => acc + item.questions.length,
    0
  );
  const totalImpressions = items.reduce(
    (acc, item) => acc + item.analytics.impressions,
    0
  );

  const quizStatsData = {
    totalQuizzes,
    totalQuestions,
    totalImpressions,
  };

  return (
    <>
      <NavBar />
      <div className={styles.container}>
        <QuizStats data={quizStatsData} />
        {items.length === 0 && (
          <div className={styles.loading}>
            <p>Loading...</p>
          </div>
        )}
        <TrendingQuiz items={items} />
      </div>
    </>
  );
}
