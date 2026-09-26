export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Methode nicht erlaubt" });
  }

  try {
    const {
      name,
      age,
      player,
      server,
      discord,
      contact,
      about,
      why,
      activity
    } = req.body;

    const emailText = `
Neue Bewerbung für Rain Ghosts

Name / Spitzname: ${name}
Level: ${age}
Star-Stable-Name: ${player || "-"}
Server: ${server || "-"}
Discord: ${discord}
Kontaktweg: ${contact}

Über die Person:
${about}

Warum Rain Ghosts?
${why || "-"}

Aktivität:
${activity}
`;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Rain Ghosts <onboarding@resend.dev>",
        to: ["starstablerainghosts@gmail.com"],
        subject: `Neue Bewerbung – ${name}`,
        text: emailText
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: data.message || "E-Mail konnte nicht gesendet werden"
      });
    }

    return res.status(200).json({
      success: true
    });

  } catch (error) {
    return res.status(500).json({
      error: "Interner Fehler beim Versenden"
    });
  }
}
