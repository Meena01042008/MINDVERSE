import { useState } from "react";
import "./Login.css";

const API_URL = "http://localhost:5000/api/auth";

function Login({ onLogin }) {
  const [mode, setMode] = useState("signin");

  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // =========================
    // REGISTER
    // =========================
    if (mode === "register") {
      if (!username || !mobile || !email || !password) {
        setError("Please fill all the details.");
        return;
      }

      if (mobile.length !== 10) {
        setError("Please enter a valid 10-digit mobile number.");
        return;
      }

      if (password.length < 6) {
        setError("Password must contain at least 6 characters.");
        return;
      }

      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            mobile,
            email,
            password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Registration failed.");
          return;
        }

        alert("Registration successful! Please sign in.");

        setMode("signin");

        setLogin(email);
        setPassword("");
        setUsername("");
        setMobile("");
      } catch (error) {
        console.error(error);
        setError(
          "Unable to connect to MINDVERSE server. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }

      return;
    }

    // =========================
    // SIGN IN
    // =========================
    if (!login || !password) {
      setError("Please enter your email/mobile and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      // Save JWT
      localStorage.setItem("mindverse_token", data.token);

      // Send MongoDB user data to App.jsx
      onLogin(data.user);
    } catch (error) {
      console.error(error);
      setError(
        "Unable to connect to MINDVERSE server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-overlay"></div>

      <div className="login-card">
        <div className="login-logo">✦</div>

        <p className="login-eyebrow">
          MINDVERSE / COGNITIVE GAMING
        </p>

        <h1>
          {mode === "signin" ? "Welcome Back" : "Create Account"}
        </h1>

        <p className="login-subtitle">
          {mode === "signin"
            ? "Enter your mind. Explore your memory."
            : "Create your account and begin your memory journey."}
        </p>

        {/* =========================
            MODE SWITCH
        ========================= */}
        <div className="login-mode-switch">
          <button
            type="button"
            className={mode === "signin" ? "active" : ""}
            onClick={() => {
              setMode("signin");
              setError("");
            }}
          >
            SIGN IN
          </button>

          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => {
              setMode("register");
              setError("");
            }}
          >
            REGISTER
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          {/* =========================
              REGISTER FIELDS
          ========================= */}
          {mode === "register" && (
            <>
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
            </>
          )}

          {/* =========================
              SIGN IN FIELD
          ========================= */}
          {mode === "signin" && (
            <>
              <label>Email or Mobile Number</label>

              <input
                type="text"
                placeholder="Enter email or mobile number"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
            </>
          )}

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* ERROR */}
          {error && (
            <p
              style={{
                color: "#ff6b6b",
                fontSize: "14px",
                marginTop: "10px",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading
              ? "PLEASE WAIT..."
              : mode === "signin"
              ? "ENTER MINDVERSE"
              : "CREATE ACCOUNT"}{" "}
            <span>→</span>
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