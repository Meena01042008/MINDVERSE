import { useState } from "react";
import "./Login.css";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !mobile || !email || !password) {
      alert("Please fill all the details.");
      return;
    }

    if (mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    onLogin({
      username,
      mobile,
      email,
    });
  };

  return (
    <div className="login-page">
      <div className="login-overlay"></div>

      <div className="login-card">
        <div className="login-logo">✦</div>

        <p className="login-eyebrow">
          MINDVERSE / COGNITIVE GAMING
        </p>

        <h1>Welcome Back</h1>

        <p className="login-subtitle">
          Enter your mind. Explore your memory.
        </p>

        <form onSubmit={handleSubmit}>

          <label>Username</label>

          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Mobile Number</label>

          <input
            type="tel"
            placeholder="Enter 10-digit mobile number"
            value={mobile}
            onChange={(e) =>
              setMobile(
                e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 10)
              )
            }
          />

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