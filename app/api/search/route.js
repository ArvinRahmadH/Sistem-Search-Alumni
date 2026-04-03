import { NextResponse } from "next/server";

export async function POST(req) {
  const { name, nim, university } = await req.json();

  const query = `${name} ${nim} ${university} alumni`;

  try {
    /* GOOGLE SEARCH */
    const serpRes = await fetch(
      `https://serpapi.com/search.json?q=${encodeURIComponent(
        query
      )}&api_key=4b15bb8e55100a906ee08442e4891bf977dfe9988017a7909e73d0953db32a26`
    );

    const serpData = await serpRes.json();

    /* PDDIKTI SEARCH */
    const searchQuery = nim || name;

    const pddiktiRes = await fetch(
      `https://api.ryzumi.net/api/search/mahasiswa?query=${encodeURIComponent(
        searchQuery
      )}`
    );

    const pddiktiData = await pddiktiRes.json();
    const mahasiswa = pddiktiData?.[0] || null;

    const results = {
      name: mahasiswa?.nama || name,
      nim: mahasiswa?.nim || "-",
      campus: mahasiswa?.nama_pt || "-",
      study_program: mahasiswa?.nama_prodi || "-",

      linkedin:
        serpData.organic_results?.find(r =>
          r.link.includes("linkedin.com")
        )?.link || "-",

      instagram:
        serpData.organic_results?.find(r =>
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
    console.error(err);

    return NextResponse.json(
      { error: "Search gagal" },
      { status: 500 }
    );
  }
}