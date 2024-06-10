import styles from "./TrendingQuiz.module.css";
import PropTypes from "prop-types";
import impressionIcon from "../../../assets/impressions.png";

export default function TrendingQuiz({ items }) {
  const rows = [];
  for (let i = 0; i < items.length; i += 4) {
    rows.push(items.slice(i, i + 4));
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  return (
    <div className={styles.trendingContainer}>
      <h3 className={styles.trendingTitle}>Trending Quizzes</h3>
      {rows.map((row) => (
        <div key={row.map(item => item._id)} className={styles.trendingList}>
          {row.map((item) => (
            <div key={item.id} className={styles.trendingItem}>
              <div className={styles.quizHeader}>
                <h4 className={styles.quizTitle}>{item.quizName}</h4>
                <div className={styles.impressions}>
                  <span>{item.analytics.impressions}</span>
                  <img
                    src={impressionIcon}
                    alt="Impressions"
                    className={styles.impressionIcon}
                  />
                </div>
              </div>
              <div className={styles.quizDetails}>
                <p>
                  Created on: {formatDate(item.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

TrendingQuiz.propTypes = {
  items: PropTypes.array.isRequired,
};
