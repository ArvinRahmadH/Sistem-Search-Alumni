import { db } from "@/lib/firebase";
import { NextResponse } from "next/server";
import { doc, deleteDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { message: "ID tidak ditemukan" },
        { status: 400 }
      );
    }

    // 🔥 delete document firestore
    await deleteDoc(doc(db, "alumni", id));

    return NextResponse.json({
      message: "Data berhasil dihapus",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Gagal menghapus data" },
      { status: 500 }
    );
  }
}