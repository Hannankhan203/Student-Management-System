import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;

    navigate("/dashboard");
      return { user };

    } catch (err) {
      const errorCode = err.code;
      const errorMessage = err.message;
      setError(errorMessage);

      return { errorCode, errorMessage };

    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await userLogin();
    setEmail("");
    setPassword("");
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Login</h2>

        {error && <p className="error-message">{error}</p>}

      <form action="" className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="">Email</label>
        <input
          type="email"
          placeholder="Email"
          className="auth-input"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="auth-navigate">
          Don't remember your password? <Link to="/forgotpassword">Reset Password</Link>
        </p>
        <label htmlFor="">Password</label>
        <input
          type="password"
          placeholder="Password"
          className="auth-input"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="auth-navigate">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
        <button className="auth-btn" type="submit">
          {loading ? "Loggin In..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
