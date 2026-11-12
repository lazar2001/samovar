import { NextResponse } from "next/server";
import { inquiryText, sanitizeItem, type Config, type InquiryContact } from "@/lib/data";

const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: { items?: unknown; contact?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Neispravan zahtev." }, { status: 400 });
  }

  const items = (Array.isArray(body.items) ? body.items : [])
    .slice(0, 30)
    .map(sanitizeItem)
    .filter((x): x is Config => x !== null);

  const c = body.contact ?? {};
  const contact: InquiryContact = {
    name: str(c.name, 120),
    phone: str(c.phone, 40),
    email: str(c.email, 160) || undefined,
    shipping: str(c.shipping, 80),
    address: str(c.address, 300) || undefined,
    payment: str(c.payment, 80),
    note: str(c.note, 2000) || undefined,
  };

  if (!contact.name) return NextResponse.json({ error: "Upišite ime i prezime." }, { status: 422 });
  if (contact.phone.replace(/\D/g, "").length < 8)
    return NextResponse.json({ error: "Upišite ispravan broj telefona." }, { status: 422 });
  if (!items.length) return NextResponse.json({ error: "Dodajte bar jedan proizvod u upit." }, { status: 422 });

  const ref = "SV-" + String(Date.now()).slice(-6);
  const text = inquiryText(ref, items, contact);

  const demo = process.env.NEXT_PUBLIC_DEMO !== "false";
  const key = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO;
  const from = process.env.INQUIRY_FROM || "SamoVar sajt <onboarding@resend.dev>";

  // Demo režim ili slanje nije podešeno: upit se samo vraća kupcu.
  if (demo || !key || !to) {
    return NextResponse.json({ ref, text, sent: false });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: to.split(",").map((s) => s.trim()),
      reply_to: contact.email,
      subject: `Novi upit ${ref} — ${contact.name}`,
      text,
    }),
  });

  if (!res.ok) {
    console.error("Resend greška", res.status, await res.text());
    return NextResponse.json(
      { error: "Upit trenutno ne može da se pošalje. Pozovite nas na +381 69 6188 96." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ref, text, sent: true });
}
