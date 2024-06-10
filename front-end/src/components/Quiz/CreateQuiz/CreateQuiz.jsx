import styles from "./CreateQuiz.module.css";
import CreateQuizModal from "./CreateQuizModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateQuizQuestion from "./CreateQuizQuestion";
import CreatePollQuestion from "./CreatePollQuestion";
import QuizSuccessModal from "./QuizSuccessModal";

export default function CreateQuiz() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isCreateQuizModalOpen, setIsCreateQuizModalOpen] = useState(false);
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  const [quizName, setQuizName] = useState("");
  const [quizType, setQuizType] = useState("Q & A");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [code, setCode] = useState(null);

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/dashboard");
  };

  const openSecondModal = (quizType) => {
    setCode(null);
    if (quizType === "Q & A") {
      setIsCreateQuizModalOpen(true);
    } else {
      setIsPollModalOpen(true);
    }
  };

  const handleCreateQuizSuccess = (quizCode) => {
    setIsCreateQuizModalOpen(false);
    setIsModalOpen(false);
    setShowSuccessModal(true);
    setCode(quizCode);
  };

  const handleCreatePollSuccess = (pollCode) => {
    setIsPollModalOpen(false);
    setIsModalOpen(false);
    setShowSuccessModal(true);
    setCode(pollCode);
  };

  return (
    <div className={styles.createQuizPage}>
      {isModalOpen && (
        <CreateQuizModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={openSecondModal}
          quizName={quizName}
          setQuizName={setQuizName}
          quizType={quizType}
          setQuizType={setQuizType}
        />
      )}
      {isCreateQuizModalOpen && (
        <CreateQuizQuestion
          isOpen={isCreateQuizModalOpen}
          onClose={() => setIsCreateQuizModalOpen(false)}
          quizName={quizName}
          quizType={quizType}
          onSuccess={handleCreateQuizSuccess}
        />
      )}
      {isPollModalOpen && (
        <CreatePollQuestion
          isOpen={isPollModalOpen}
          onClose={() => setIsPollModalOpen(false)}
          quizName={quizName}
          quizType={quizType}
          onSuccess={handleCreatePollSuccess}
        />
      )}
      {showSuccessModal && (
        <QuizSuccessModal
          onClose={() => setShowSuccessModal(false)}
          code={code}
          quizType={quizType}
        />
      )}
    </div>
  );
}
