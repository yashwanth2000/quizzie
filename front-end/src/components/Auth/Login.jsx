import { useState } from "react";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { login } from "../../utils/auth";
import { toast, Zoom, ToastContainer } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const { email, password } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(formData);
      toast.success("Login Successfull", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "dark",
        transition: Zoom,
      });
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      if (
        error.message.includes("User not found") ||
        error.message.includes("Invalid credentials")
      ) {
        setError(error.message);
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.labelInputPair}>
          <label htmlFor="email" className={styles.formLabel}>
            Email
          </label>
          <input
            type="email"
            name="email"
            className={`${styles.formInput} ${
              error.includes("User not found") ? styles.error : ""
            }`}
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.labelInputPair}>
          <label htmlFor="password" className={styles.formLabel}>
            Password
          </label>
          <input
            type="password"
            name="password"
            className={`${styles.formInput} ${
              error.includes("Invalid credentials") ? styles.error : ""
            }`}
            value={password}
            onChange={handleChange}
            required
            autoComplete="on"
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.logInBtn}>
          Log In
        </button>
      </form>
      <ToastContainer />
    </>
  );
}
