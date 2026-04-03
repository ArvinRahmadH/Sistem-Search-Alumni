"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import "./login.css"; // ✅ import css

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/menu");
    } catch (err) {
      setError("Login gagal");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h2 className="login-title">Alumni Search</h2>
        <p className="login-subtitle">Silakan login untuk melanjutkan</p>

        <form onSubmit={handleLogin} className="login-form">

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Masukkan email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Masukkan password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

        </form>

        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
}