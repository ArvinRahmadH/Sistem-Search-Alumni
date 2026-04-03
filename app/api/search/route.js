import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, nim, university } = await req.json();

    const query = `${name} ${nim} ${university} alumni`;

    /* ================= SERP API ================= */
    const serpRes = await fetch(
      `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${process.env.SERP_API_KEY}`
    );

    const serpData = await serpRes.json();

    console.log("SERP:", serpData);

    /* ================= PDDIKTI ================= */
    const searchQuery = nim || name;

    const pddiktiRes = await fetch(
      `https://api.ryzumi.net/api/search/mahasiswa?query=${encodeURIComponent(searchQuery)}`
    );

    const pddiktiData = await pddiktiRes.json();

    console.log("PDDIKTI:", pddiktiData);

    const mahasiswa = pddiktiData?.[0] || null;

    const results = {
      name: mahasiswa?.nama || name || "-",
      nim: mahasiswa?.nim || "-",
      campus: mahasiswa?.nama_pt || "-",
      study_program: mahasiswa?.nama_prodi || "-",

      linkedin:
        serpData?.organic_results?.find((r) =>
          r.link.includes("linkedin.com")
        )?.link || "-",

      instagram:
        serpData?.organic_results?.find((r) =>
          r.link.includes("instagram.com")
        )?.link || "-",

      email: "-",
      no_hp: "-",
      tempat_bekerja: "-",
      alamat_bekerja: "-",
      posisi: "-",
      jenis_pekerjaan: "-",
      alamat_sosial_media: "-",
    };

    return NextResponse.json(results);
  } catch (err) {
    console.error("ERROR API:", err);

    return NextResponse.json(
      { error: "Search gagal" },
      { status: 500 }
    );
  }
}