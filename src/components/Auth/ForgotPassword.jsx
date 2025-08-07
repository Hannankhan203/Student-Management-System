import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  // const navigate = useNavigate();

  const userResetPass = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await sendPasswordResetEmail(auth, email, {
        url: "http://localhost:3000/login",
        handleCodeInApp: false,
      });
      setSuccess(true);
    } catch (err) {
      console.error("Error sending reset email:", err);
      setError(err.message.includes("user-not-found") 
        ? "No account found with this email" 
        : "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await userResetPass();
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Reset Password</h2>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">Password reset email sent! Check your inbox.</p>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          placeholder="Email"
          className="auth-input"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <p className="auth-navigate">
          Remember your password? <Link to="/login">Login</Link>
        </p>
        <button 
          className="auth-btn" 
          type="submit"
          disabled={loading}
        >
          {loading ? "Sending Email..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;