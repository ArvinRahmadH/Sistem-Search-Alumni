export async function POST(req) {
  try {
    const { name } = await req.json();

    const res = await fetch(
      `https://serpapi.com/search.json?q=${encodeURIComponent(name)}&api_key=4b15bb8e55100a906ee08442e4891bf977dfe9988017a7909e73d0953db32a26`
    );

    const data = await res.json();

    const results = data.organic_results || [];

    let linkedin = "-";
    let instagram = "-";

    results.forEach((item) => {
      const link = item.link;

      if (link.includes("linkedin.com") && linkedin === "-") {
        linkedin = link;
      }

      if (link.includes("instagram.com") && instagram === "-") {
        instagram = link;
      }
    });

    return Response.json({ linkedin, instagram });

  } catch (err) {
    console.error("API ERROR:", err);
    return Response.json(
      { linkedin: "-", instagram: "-" },
      { status: 500 }
    );
  }
}