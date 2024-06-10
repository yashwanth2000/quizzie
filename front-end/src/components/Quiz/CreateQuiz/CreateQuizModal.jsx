import styles from "./CreateQuizModal.module.css";
import PropTypes from "prop-types";

export default function CreateQuizModal({
  isOpen,
  onClose,
  onSubmit,
  quizName,
  setQuizName,
  quizType,
  setQuizType,
}) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(quizType);
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <form onSubmit={handleSubmit}>
          <div className={styles.quizName}>
            <input
              type="text"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
              required
              placeholder="Quiz Name"
            />
          </div>
          <div className={styles.quizType}>
            <label>Quiz Type</label>
            <div className={styles.quizTypeContainer}>
              <button
                type="button"
                className={`${styles.quizTypeButton} ${
                  quizType === "Q & A" ? styles.active : ""
                }`}
                onClick={() => setQuizType("Q & A")}
              >
                Q & A
              </button>
              <button
                type="button"
                className={`${styles.quizTypeButton} ${
                  quizType === "Poll" ? styles.active : ""
                }`}
                onClick={() => setQuizType("Poll")}
              >
                Poll
              </button>
            </div>
          </div>
          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" className={styles.continueButton}>
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

CreateQuizModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  quizName: PropTypes.string.isRequired,
  setQuizName: PropTypes.func.isRequired,
  quizType: PropTypes.string.isRequired,
  setQuizType: PropTypes.func.isRequired,
};
