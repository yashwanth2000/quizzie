import { useContext } from "react";
import styles from "./NavBar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../utils/AuthContext.jsx";

export default function NavBar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={styles.navbar}>
      <h1 className={styles.title} onClick={() => navigate("/dashboard")}>
        QUIZZIE
      </h1>

      <div className={styles.links}>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive
              ? `${styles.dashboard} ${styles.isActive}`
              : styles.dashboard
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            isActive
              ? `${styles.analytics} ${styles.isActive}`
              : styles.analytics
          }
        >
          Analytics
        </NavLink>
        <NavLink
          to="/create-quiz"
          className={({ isActive }) =>
            isActive
              ? `${styles.createQuiz} ${styles.isActive}`
              : styles.createQuiz
          }
        >
          Create Quiz
        </NavLink>
      </div>

      <button className={styles.logout} onClick={handleLogout}>
        LOGOUT
      </button>
    </div>
  );
}
