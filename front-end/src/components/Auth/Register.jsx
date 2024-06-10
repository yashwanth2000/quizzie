import { useState, useContext } from "react";
import styles from "./Register.module.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../utils/AuthContext";
import { toast, Zoom, ToastContainer } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setValidationErrors({});
    setServerError("");
  };

  const validateForm = () => {
    const errors = {};

    if (formData.name.trim() === "") {
      errors.name = "Invalid Name";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email address";
    }

    if (formData.password.trim() === "") {
      errors.password = "Password is required";
    } else if (
      formData.password.length < 6 ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
    ) {
      errors.password = "Weak Password";
    }

    if (formData.confirmPassword.trim() === "") {
      errors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await register(formData);
      toast.success("Registration successful! Please log in.", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        theme: "dark",
        draggable: true,
        transition: Zoom,
      });
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      if (error.message.includes("Email already in use")) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          email: "Email already in use",
        }));
      } else {
        setServerError(error.message);
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.labelInputPair}>
          <label htmlFor="name" className={styles.formLabel}>
            Name
          </label>
          <input
            type="text"
            name="name"
            className={`${styles.formInput} ${
              validationErrors.name ? styles.errorInput : ""
            }`}
            value={formData.name}
            onChange={handleChange}
            placeholder={validationErrors.name || ""}
          />
        </div>
        <div className={styles.labelInputPair}>
          <label htmlFor="email" className={styles.formLabel}>
            Email
          </label>
          <input
            type="email"
            name="email"
            className={`${styles.formInput} ${
              validationErrors.email ? styles.errorInput : ""
            }`}
            value={formData.email}
            onChange={handleChange}
            placeholder={validationErrors.email || ""}
          />
        </div>
        {validationErrors.email && formData.email && (
          <span className={styles.errorMessage}>{validationErrors.email}</span>
        )}
        <div className={styles.labelInputPair}>
          <label htmlFor="password" className={styles.formLabel}>
            Password
          </label>
          <input
            type="password"
            name="password"
            className={`${styles.formInput} ${
              validationErrors.password ? styles.errorInput : ""
            }`}
            value={formData.password}
            onChange={handleChange}
            placeholder={validationErrors.password || ""}
          />
        </div>
        {validationErrors.password && formData.password && (
          <span className={styles.errorMessage}>
            {validationErrors.password}
          </span>
        )}
        <div className={styles.labelInputPair}>
          <label htmlFor="confirm-password" className={styles.formLabel}>
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            className={`${styles.formInput} ${
              validationErrors.confirmPassword ? styles.errorInput : ""
            }`}
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder={validationErrors.confirmPassword || ""}
          />
        </div>
        {validationErrors.confirmPassword && formData.confirmPassword && (
          <span className={styles.errorMessage}>
            {validationErrors.confirmPassword}
          </span>
        )}
        {serverError && (
          <span className={styles.errorMessage}>{serverError}</span>
        )}
        <button type="submit" className={styles.signUpBtn}>
          Sign Up
        </button>
      </form>
      <ToastContainer />
    </>
  );
}
