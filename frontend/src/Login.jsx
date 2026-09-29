import { useState } from "react";
import "./Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    // Temporary frontend login
    onLogin();
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">✦</div>

        <p className="login-eyebrow">MINDVERSE / COGNITIVE GAMING</p>

        <h1>Welcome Back</h1>

        <p className="login-subtitle">
          Enter your mind. Explore your memory.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">
            ENTER MINDVERSE <span>→</span>
          </button>
        </form>

        <p className="login-footer">
          PLAY • THINK • EXPLORE • EVOLVE
        </p>
      </div>
    </div>
  );
}

export default Login;