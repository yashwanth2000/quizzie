import { useState } from "react";
import styles from "./QuizSuccessModal.module.css";
import PropTypes from "prop-types";
import closeBtn from "../../../assets/close.png";
import { useNavigate } from "react-router-dom";
import copyToClipboard from "copy-to-clipboard";
import { ToastContainer, toast } from "react-toastify";

export default function QuizSuccessModal({ onClose, code, quizType }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  let quizUrl;
  if (quizType === "Poll") {
    quizUrl = import.meta.env.VITE_SHARE_URL + `/poll/${code}`;
  } else {
    quizUrl = import.meta.env.VITE_SHARE_URL + `/quiz/${code}`;
  }

  const handleCopy = () => {
    copyToClipboard(quizUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: "dark",
    }),
      setTimeout(() => {
        setCopied(false);
      }, 1000);
  };

  const handleClose = () => {
    onClose();
    navigate("/dashboard");
  };
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <img
          src={closeBtn}
          alt="close"
          className={styles.closeButton}
          onClick={handleClose}
        />
        <h3>Congrats your Quiz is Published!</h3>
        <p>{quizUrl}</p>
        <button className={styles.shareButton} onClick={handleCopy}>
          {copied ? "Copied!" : "Share"}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

QuizSuccessModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  quizType: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
};
