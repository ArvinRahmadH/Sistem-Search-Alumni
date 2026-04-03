"use client";

import { useState, useEffect } from "react";
import { DEFAULT_UNIVERSITY } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import "./home.css"; // ✅ tambah css

export default function Home() {
  const router = useRouter();

  const [authLoading, setAuthLoading] = useState(true);

  const [name, setName] = useState("");
  const [nim, setNim] = useState("");
  const [university] = useState(DEFAULT_UNIVERSITY);

  const [result, setResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  /* ================= LOGIN CHECK ================= */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  /* ================= SEARCH ================= */
  const search = async () => {
    setSearchLoading(true);

    const res = await fetch("/api/search", {
      method: "POST",
      body: JSON.stringify({ name, nim, university }),
    });

    const data = await res.json();
    setResult(data);
    setSearchLoading(false);
  };

  const save = async () => {
    await fetch("/api/save", {
      method: "POST",
      body: JSON.stringify(result),
    });

    alert("Data berhasil disimpan!");
  };

  if (authLoading)
    return <h3 className="loading">Checking login...</h3>;

  return (
    <div className="home-container">
      <div className="home-card">

        <h1 className="title">Cari Data Alumni</h1>

        <div className="input-group">
          <label>Nama Alumni</label>
          <input
            placeholder="Masukkan nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>NIM</label>
          <input
            placeholder="Masukkan NIM"
            value={nim}
            onChange={(e) => setNim(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Universitas</label>
          <input value={university} readOnly />
        </div>

        <button className="primary-btn" onClick={search}>
          {searchLoading ? "Mencari..." : "Cari Alumni"}
        </button>

        {result && (
          <div className="result-box">
            <h3>Hasil Pencarian</h3>

            <p><b>Nama:</b> {result.name}</p>
            <p><b>NIM:</b> {result.nim}</p>
            <p><b>Kampus:</b> {result.campus}</p>
            <p><b>Prodi:</b> {result.study_program}</p>
            <p><b>LinkedIn:</b> {result.linkedin || "-"}</p>
            <p><b>Instagram:</b> {result.instagram || "-"}</p>

            <button className="success-btn" onClick={save}>
              Simpan Informasi
            </button>
          </div>
        )}

        <div className="menu-buttons">
          <button
            className="secondary-btn"
            onClick={() => router.push("/alumni")}
          >
            Lihat Daftar Alumni
          </button>

          <button
            className="danger-btn"
            onClick={async () => {
              await signOut(auth);
              router.push("/");
            }}
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}