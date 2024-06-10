import { useState, useEffect } from "react";
import Analytics from "../../components/Quiz/Analytics/Analytics";
import NavBar from "../../components/Quiz/Navbar/NavBar.jsx";
import styles from "./AnalyticsPage.module.css";
import { getAllQuizzes } from "../../utils/quizAPI";
import { getAllPolls } from "../../utils/pollAPI";

export default function AnalyticsPage() {
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

  if (!items) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <>
      <NavBar />
      <div className={styles.container}>
        <h2 className={styles.heading}>Quiz Analysis</h2>
        <Analytics data={items} />
      </div>
    </>
  );
}
