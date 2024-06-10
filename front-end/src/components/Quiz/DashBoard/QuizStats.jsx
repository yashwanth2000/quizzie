import PropTypes from "prop-types";
import styles from "./QuizStats.module.css";

export default function QuizStats({ data }) {
  const { totalQuizzes, totalQuestions, totalImpressions } = data;

  const formatImpressions = (count) => {
    return count < 1000 ? count : (count / 1000).toFixed(1) + "k";
  };

  return (
    <div className={styles.statsContainer}>
      <div className={`${styles.statItem} ${styles.firstStat}`}>
        <h3>{totalQuizzes}</h3>
        <p>Quiz Created</p>
      </div>
      <div className={`${styles.statItem} ${styles.secondStat}`}>
        <h3>{totalQuestions}</h3>
        <p>Questions Created</p>
      </div>
      <div className={`${styles.statItem} ${styles.thirdStat}`}>
        <h3>{formatImpressions(totalImpressions)}</h3>
        <p>Total Impressions</p>
      </div>
    </div>
  );
}

QuizStats.propTypes = {
  data: PropTypes.shape({
    totalQuizzes: PropTypes.number.isRequired,
    totalQuestions: PropTypes.number.isRequired,
    totalImpressions: PropTypes.number.isRequired,
  }).isRequired,
};
