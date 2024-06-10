import Register from "../../components/Auth/Register.jsx";
import styles from "./RegisterPage.module.css";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div className={styles.outerContainer}>
      <div className={styles.container}>
        <h1 className={styles.title}>QUIZZIE</h1>
        <div className={styles.headerContainer}>
          <p className={`${styles.button} ${styles.signUp}`}>Sign Up</p>
          <Link to="/login" className={`${styles.button} ${styles.logInLink}`}>
            Log In
          </Link>
        </div>
        <Register />
      </div>
    </div>
  );
}
