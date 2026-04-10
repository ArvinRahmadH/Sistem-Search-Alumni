"use client";

import { useState, useEffect } from "react";
import { DEFAULT_UNIVERSITY } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import "./home.css";

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

  /* ================= SEARCH SOCIAL MEDIA ================= */
    const searchSocialMedia = async (name) => {
    try {
      const res = await fetch("/api/social", {
        method: "POST",
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      return data;
    } catch (err) {
      console.error("Frontend ERROR:", err);
      return { linkedin: "-", instagram: "-" };
    }
  };

  /* ================= SEARCH ================= */
  const search = async () => {
    setSearchLoading(true);

    try {
      const query = nim || name;

      if (!query) {
        alert("Isi Nama atau NIM dulu!");
        setSearchLoading(false);
        return;
      }

      const res = await fetch(
        `https://api.ryzumi.net/api/search/mahasiswa?query=${encodeURIComponent(
          query
        )}`
      );

      if (!res.ok) {
        throw new Error("API Error");
      }

      const data = await res.json();
      console.log("DATA API:", data);

      const mahasiswa = data?.[0];

      // 🔥 ambil nama final
      const namaFinal = mahasiswa?.nama || name;

      // 🔥 cari social media
      const social = await searchSocialMedia(namaFinal);

      setResult({
        name: mahasiswa?.nama || name || "-",
        nim: mahasiswa?.nim || "-",
        campus: mahasiswa?.nama_pt || "Tidak ditemukan",
        study_program: mahasiswa?.nama_prodi || "Tidak ditemukan",
        linkedin: social.linkedin,
        instagram: social.instagram,
      });

    } catch (err) {
      console.error("ERROR:", err);

      setResult({
        name: name || "Tidak diketahui",
        nim: nim || "-",
        campus: university,
        study_program: "Data tidak tersedia",
        linkedin: "-",
        instagram: "-",
      });

      alert("API gagal, menampilkan data manual");
    } finally {
      setSearchLoading(false);
    }
  };

  /* ================= SAVE ================= */
  const save = async () => {
    try {
      const res = await fetch("/api/save", {
        method: "POST",
        body: JSON.stringify(result),
      });

      if (!res.ok) {
        alert("Gagal menyimpan data");
        return;
      }

      alert("Data berhasil disimpan!");
    } catch (err) {
      console.error(err);
      alert("Terjadi error saat menyimpan");
    }
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

            <p>
              <b>LinkedIn:</b>{" "}
              {result.linkedin !== "-" ? (
                <a href={result.linkedin} target="_blank" rel="noopener noreferrer">
                  {result.linkedin}
                </a>
              ) : "-"}
            </p>

            <p>
              <b>Instagram:</b>{" "}
              {result.instagram !== "-" ? (
                <a href={result.instagram} target="_blank" rel="noopener noreferrer">
                  {result.instagram}
                </a>
              ) : "-"}
            </p>

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