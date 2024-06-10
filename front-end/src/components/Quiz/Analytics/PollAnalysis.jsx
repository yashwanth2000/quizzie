import { useEffect, useState } from "react";
import styles from "./PollAnalysis.module.css";
import NavBar from "../Navbar/NavBar.jsx";
import { useParams } from "react-router-dom";
import { getPollById } from "../../../utils/pollAPI";

export default function PollAnalysis() {
  const { pollId } = useParams();
  const [pollData, setPollData] = useState(null);

  useEffect(() => {
    async function fetchData(pollId) {
      const data = await getPollById(pollId);
      setPollData(data);
    }

    fetchData(pollId);
  }, [pollId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  if (!pollData) return null;

  return (
    <>
      <NavBar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Poll Question Analysis</h2>
          <div className={styles.headerInfo}>
            <p>Created On: {formatDate(pollData.createdAt)}</p>
            <p>Impressions: {pollData.analytics.impressions}</p>
          </div>
        </div>
        <div className={styles.content}>
          {pollData.questions.map((question, index) => (
            <div key={question._id} className={styles.questionBlock}>
              <p className={styles.question}>
                Q{index + 1}. {question.questionText}
              </p>
              <div className={styles.card}>
                {question.options.map((option, optionIndex) => (
                  <div key={option._id} className={styles.cardItem}>
                    <p className={styles.cardNumber}>
                      {question.optionCounts[optionIndex]}
                    </p>
                    {question.optionType === "Image URL" ? (
                      <p className={styles.cardText}>
                        Option {optionIndex + 1}
                      </p>
                    ) : (
                      <p className={styles.cardText}>{option.text}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
