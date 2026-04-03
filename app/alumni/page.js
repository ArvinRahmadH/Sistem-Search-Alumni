"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import "./home.css"; // pastikan home.css ada di folder yang sama

export default function AlumniPage() {
  const router = useRouter();

  const [authLoading, setAuthLoading] = useState(true);
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});

  /* ================= LOGIN CHECK ================= */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/");
      } else {
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (!authLoading) {
      fetchAlumni();
    }
  }, [authLoading]);

  const fetchAlumni = async () => {
    setLoading(true);
    const res = await fetch("/api/alumni");
    const data = await res.json();

    setAlumni(data);
    setLoading(false);
  };

  /* ================= EDIT ================= */
  const startEdit = (item) => {
    setEditingId(item.id);
    setForm(item);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const updateAlumni = async () => {
    await fetch("/api/update-alumni", {
      method: "POST",
      body: JSON.stringify(form),
    });

    alert("Data berhasil diperbarui!");
    setEditingId(null);
    fetchAlumni();
  };

  const deleteAlumni = async (id) => {
    if (!confirm("Yakin ingin menghapus data alumni ini?")) return;

    await fetch("/api/delete-alumni", {
      method: "POST",
      body: JSON.stringify({ id }),
    });

    alert("Data berhasil dihapus!");
    fetchAlumni();
  };

  /* ================= INPUT COMPONENT ================= */
  const renderInput = (label, name) => {
    return (
      <div className="input-group">
        <label>{label}</label>
        <input
          name={name}
          value={form[name] || ""}
          onChange={handleChange}
        />
      </div>
    );
  };

  /* ================= AUTH LOADING ================= */
  if (authLoading) {
    return <h3 style={{ padding: 40 }}>Checking login...</h3>;
  }

  /* ================= UI ================= */
  return (
    <div className="container">
      <h1>Daftar Alumni Tersimpan</h1>

      <button className="back-button" onClick={() => router.push("/menu")}>
        ← Kembali ke Menu
      </button>

      <br />
      <br />

      {loading && <p>Loading data...</p>}
      {!loading && alumni.length === 0 && <p>Belum ada data alumni.</p>}

      {alumni.map((item) => (
        <div key={item.id} className="alumni-card">
          <p><b>Nama:</b> {item.name}</p>
          <p><b>NIM:</b> {item.nim}</p>
          <p><b>Kampus:</b> {item.campus}</p>
          <p><b>Prodi:</b> {item.study_program}</p>

          <hr />

          {editingId === item.id ? (
            <>
              {renderInput("Email", "email")}
              {renderInput("No HP", "no_hp")}
              {renderInput("Tempat Bekerja", "tempat_bekerja")}
              {renderInput("Alamat Bekerja", "alamat_bekerja")}
              {renderInput("Posisi", "posisi")}
              {renderInput("Jenis Pekerjaan", "jenis_pekerjaan")}
              {renderInput("Sosial Media", "alamat_sosial_media")}

              <br />

              <button className="save-button" onClick={updateAlumni}>
                💾 Simpan Update
              </button>
            </>
          ) : (
            <>
              <p><b>Email:</b> {item.email || "-"}</p>
              <p><b>No HP:</b> {item.no_hp || "-"}</p>
              <p><b>Tempat Bekerja:</b> {item.tempat_bekerja || "-"}</p>
              <p><b>Alamat Bekerja:</b> {item.alamat_bekerja || "-"}</p>
              <p><b>Posisi:</b> {item.posisi || "-"}</p>
              <p><b>Jenis Pekerjaan:</b> {item.jenis_pekerjaan || "-"}</p>
              <p><b>Sosial Media:</b> {item.alamat_sosial_media || "-"}</p>

              <button className="edit-button" onClick={() => startEdit(item)}>
                ✏️ Edit
              </button>

              <button
                className="delete-button"
                onClick={() => deleteAlumni(item.id)}
                style={{ marginLeft: 10 }}
              >
                🗑️ Hapus
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}