import { useState, useEffect } from "react";
import styles from "./Analytics.module.css";
import editIcon from "../../../assets/edit.png";
import deleteIcon from "../../../assets/delete.png";
import shareIcon from "../../../assets/share.png";
import DeleteModal from "./DeleteModal";
import { deleteQuiz } from "../../../utils/quizAPI";
import { deletePoll } from "../../../utils/pollAPI";
import { Link } from "react-router-dom";
import copy from "copy-to-clipboard";
import { toast, ToastContainer } from "react-toastify";
import UpdatePollModal from "./UpdatePollModal";
import UpdateQuizModal from "./UpdateQuizModal";
import PropTypes from "prop-types";

export default function Analytics({ data }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [items, setItems] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItemData, setEditItemData] = useState(null);

  useEffect(() => {
    if (data && data.length > 0) {
      setItems(data);
    }
  }, [data]);

  if (items.length === 0) return <div className={styles.loading}>Loading...</div>;

  const handleDelete = (id) => {
    setSelectedItemId(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowModal(false);
    const selectedItem = items.find((item) => item._id === selectedItemId);

    if (selectedItem) {
      try {
        if (selectedItem.quizType === "Q & A") {
          await deleteQuiz(selectedItemId);
        } else {
          await deletePoll(selectedItemId);
        }
        const updatedItems = items.filter(
          (item) => item._id !== selectedItemId
        );
        setItems(updatedItems);
        toast.success("Item deleted successfully", {
          position: "top-right",
          autoClose: 500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "dark",
        });
      } catch (error) {
        console.error("Failed to delete item:", error);
        toast.error("Failed to delete item. Please try again.", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "dark",
        });
      }
    }
  };

  const handleCancelDelete = () => {
    setSelectedItemId(null);
    setShowModal(false);
  };

  const handleAnalysisClick = (id) => {
    setSelectedItemId(id);
  };

  const handleShare = (item) => {
    const code = item.quizType === "Poll" ? item.pollCode : item.quizCode;
    const quizType = item.quizType === "Poll" ? "poll" : "quiz";

    const url = import.meta.env.VITE_SHARE_URL + `/${quizType}/${code}`;

    try {
      const success = copy(url);
      if (success) {
        toast.success("Link copied to clipboard", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "dark",
        });
      } else {
        toast.error("Failed to copy. Please try again.");
      }
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleEdit = (item) => {
    setSelectedItemId(item._id);
    setEditItemData(item);
    setShowEditModal(true);
  };

  const handleUpdateSuccess = (updatedData) => {
    setShowEditModal(false);
    const updatedItemIndex = items.findIndex(
      (item) => item._id === updatedData._id
    );
    if (updatedItemIndex !== -1) {
      const newItems = [...items];
      newItems[updatedItemIndex] = updatedData;
      setItems(newItems);
      toast.success("Item updated successfully", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "dark",
      });
    } else {
      console.error("Updated item not found in the list");
    }
  };

  const renderItems = () => {
    return items.map((item, index) => (
      <tr key={index + 1}>
        <td>{index + 1}</td>
        <td>{item.quizName}</td>
        <td>{formatDate(item.createdAt)}</td>
        <td>{item.analytics.impressions}</td>
        <td>
          <img
            src={editIcon}
            alt="Edit"
            className={styles.icon}
            onClick={() => handleEdit(item)}
          />
          <img
            src={deleteIcon}
            alt="Delete"
            className={styles.icon}
            onClick={() => handleDelete(item._id)}
          />
          <img
            src={shareIcon}
            alt="Share"
            className={styles.icon}
            onClick={() => handleShare(item)}
            title="Click to copy code"
          />
        </td>
        <td>
          <Link
            to={
              item.quizType === "Q & A"
                ? `/quiz-analysis/${item._id}`
                : `/poll-analysis/${item._id}`
            }
            className={styles.analysis}
            onClick={() => handleAnalysisClick(item._id)}
          >
            Question Wise Analysis
          </Link>
        </td>
      </tr>
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Quiz Name</th>
            <th>Created on</th>
            <th>Impressions</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>{renderItems()}</tbody>
      </table>

      {showEditModal &&
        selectedItemId &&
        (editItemData.quizType === "Poll" ? (
          <UpdatePollModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            pollId={selectedItemId}
            onSuccess={handleUpdateSuccess}
          />
        ) : (
          <UpdateQuizModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            quizId={selectedItemId}
            onSuccess={handleUpdateSuccess}
          />
        ))}
      <DeleteModal
        show={showModal}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

      <ToastContainer />
    </div>
  );
}

Analytics.propTypes = {
  data: PropTypes.array.isRequired,
};
