import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { db, collection, addDoc } from "../../firebase";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userSignup = async () => {
    setLoading(true);
    setError("");

    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;

    try {
      await addDoc(collection(db, "users"), {
      username: username,
      email: user.email,
      password: password,
      uid: user.uid,
      createdAt: new Date(),
    });
    } catch (firestoreError) {
        console.error("Firestore save failed:", firestoreError);
        throw new Error("Failed to save user data");
    }

    navigate("/login");
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
    await userSignup();
    setUsername("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Sign Up</h2>

        {error && <p className="error-message">{error}</p>}

      <form action="" className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="">Username</label>
        <input
          type="text"
          placeholder="Username"
          className="auth-input"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="">Email</label>
        <input
          type="email"
          placeholder="Email"
          className="auth-input"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
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
          Already have an account? <Link to="/login">Login</Link>
        </p>
        <button className="auth-btn" type="submit">
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
