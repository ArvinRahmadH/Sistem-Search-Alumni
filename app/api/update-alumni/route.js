import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function POST(req) {
  const data = await req.json();

  try {
    const ref = doc(db, "alumni", data.id);

    await updateDoc(ref, {
      email: data.email || "-",
      no_hp: data.no_hp || "-",
      tempat_bekerja: data.tempat_bekerja || "-",
      alamat_bekerja: data.alamat_bekerja || "-",
      posisi: data.posisi || "-",
      jenis_pekerjaan: data.jenis_pekerjaan || "-",
      alamat_sosial_media: data.alamat_sosial_media || "-",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Update gagal" },
      { status: 500 }
    );
  }
}