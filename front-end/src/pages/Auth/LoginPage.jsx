import Login from "../../components/Auth/Login.jsx";
import styles from "./LoginPage.module.css";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className={styles.outerContainer}>
      <div className={styles.container}>
        <h1 className={styles.title}>QUIZZIE</h1>
        <div>
          <div className={styles.headerContainer}>
            <Link to="/" className={`${styles.button} ${styles.signUp}`}>
              Sign Up
            </Link>
            <p className={`${styles.button} ${styles.logInLink}`}>Log In</p>
          </div>
        </div>
        <Login />
      </div>
    </div>
  );
}
