"use client";

import { useRef, useState, type FormEvent } from "react";
import { useStore } from "./StoreProvider";
import { describe, inquiryText, type InquiryContact } from "@/lib/data";

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO !== "false";
const SHIP = ["Dostava na adresu", "Lično preuzimanje, Čelarevo"] as const;
const PAY = ["Pouzećem", "Uplata na račun"] as const;

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "done"; ref: string; text: string; sent: boolean };

export function Inquiry() {
  const { cart, changeQty, removeItem, clearCart } = useStore();
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const telRef = useRef<HTMLInputElement>(null);

  const [ship, setShip] = useState<(typeof SHIP)[number]>(SHIP[0]);
  const [pay, setPay] = useState<(typeof PAY)[number]>(PAY[0]);
  const [errors, setErrors] = useState({ name: false, tel: false, items: false });
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [serverError, setServerError] = useState("");
  const [copyLabel, setCopyLabel] = useState("Kopiraj tekst upita");
  const preRef = useRef<HTMLPreElement>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    const name = get("name"), phone = get("phone");
    const okTel = phone.replace(/\D/g, "").length >= 8;
    const next = { name: !name, tel: !okTel, items: cart.length === 0 };
    setErrors(next);
    if (next.name) return nameRef.current?.focus();
    if (next.tel) return telRef.current?.focus();
    if (next.items) return;

    const contact: InquiryContact = {
      name,
      phone,
      email: get("email") || undefined,
      shipping: ship,
      address: ship === SHIP[0] ? get("address") || undefined : undefined,
      payment: pay,
      note: get("note") || undefined,
    };

    setServerError("");
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/upit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, contact }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Greška pri slanju.");
      setStatus({ kind: "done", ref: data.ref, text: data.text, sent: data.sent });
    } catch (err) {
      // Ako server nije dostupan, kupac ipak dobija tekst upita da ga pošalje sam.
      const ref = "SV-" + String(Date.now()).slice(-6);
      if (IS_DEMO) {
        setStatus({ kind: "done", ref, text: inquiryText(ref, cart, contact), sent: false });
        document.getElementById("upit")?.scrollIntoView();
      } else {
        setStatus({ kind: "idle" });
        setServerError(err instanceof Error ? err.message : "Upit nije poslat. Pokušajte ponovo ili nas pozovite.");
      }
      return;
    }
    document.getElementById("upit")?.scrollIntoView();
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyLabel("Kopirano");
    } catch {
      if (preRef.current) {
        const r = document.createRange();
        r.selectNodeContents(preRef.current);
        const sel = getSelection();
        sel?.removeAllRanges();
        sel?.addRange(r);
      }
      setCopyLabel("Tekst je označen, kopirajte ga");
    }
    setTimeout(() => setCopyLabel("Kopiraj tekst upita"), 2500);
  }

  function reset() {
    clearCart();
    formRef.current?.reset();
    setShip(SHIP[0]);
    setPay(PAY[0]);
    setStatus({ kind: "idle" });
  }

  const done = status.kind === "done" ? status : null;

  return (
    <section className="sec band" id="upit">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">Vaš upit</span>
          <h2>Pošaljite upit za ponudu</h2>
        </div>

        <div className="order" hidden={!!done}>
          <div>
            {cart.length > 0 ? (
              <ul className="items">
                {cart.map((it) => {
                  const d = describe(it);
                  return (
                    <li className="item" key={it.id}>
                      <span className="t">{d.title}</span>
                      <span className="d">{d.attrs.join(" · ")}</span>
                      <span className="ops">
                        <span className="qty" role="group" aria-label="Količina">
                          <button type="button" aria-label="Manje" onClick={() => changeQty(it.id, -1)}>
                            −
                          </button>
                          <output>{it.qty}</output>
                          <button type="button" aria-label="Više" onClick={() => changeQty(it.id, 1)}>
                            +
                          </button>
                        </span>
                        <button type="button" className="linkbtn" onClick={() => removeItem(it.id)}>
                          Ukloni
                        </button>
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="empty">
                <span>Upit je prazan. Složite kućicu ili boks i dodajte ih ovde.</span>
                <a className="btn sm ghost" href="#konfigurator">
                  Otvori konfigurator
                </a>
              </div>
            )}
          </div>

          <form className="f" ref={formRef} onSubmit={onSubmit} noValidate>
            <div className="fld">
              <label htmlFor="fName">Ime i prezime</label>
              <input type="text" id="fName" name="name" autoComplete="name" ref={nameRef} />
              <span className="e" hidden={!errors.name}>Upišite ime i prezime.</span>
            </div>
            <div className="fld">
              <label htmlFor="fTel">Telefon</label>
              <input type="tel" id="fTel" name="phone" autoComplete="tel" placeholder="06x xxx xxxx" ref={telRef} />
              <span className="e" hidden={!errors.tel}>Upišite broj telefona na koji možemo da vas pozovemo.</span>
            </div>
            <div className="fld">
              <label htmlFor="fMail">Email (nije obavezan)</label>
              <input type="email" id="fMail" name="email" autoComplete="email" />
            </div>
            <div className="fld">
              <span className="lbl">Preuzimanje</span>
              <div className="seg">
                {SHIP.map((v, i) => (
                  <label key={v}>
                    <input type="radio" name="ship" value={v} checked={ship === v} onChange={() => setShip(v)} />
                    <span>{i === 0 ? v : "Lično, Čelarevo"}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="fld" hidden={ship !== SHIP[0]}>
              <label htmlFor="fAddr">Mesto i adresa dostave</label>
              <input type="text" id="fAddr" name="address" autoComplete="street-address" />
            </div>
            <div className="fld">
              <span className="lbl">Plaćanje</span>
              <div className="seg">
                {PAY.map((v) => (
                  <label key={v}>
                    <input type="radio" name="pay" value={v} checked={pay === v} onChange={() => setPay(v)} />
                    <span>{v}</span>
                  </label>
                ))}
              </div>
              <span className="hint">{pay === PAY[1] ? "Podatke za uplatu dobijate uz ponudu." : "Plaćate prilikom preuzimanja."}</span>
            </div>
            <div className="fld">
              <label htmlFor="fNote">Napomena</label>
              <textarea id="fNote" name="note" placeholder="Rasa psa, posebne želje, rok…" />
            </div>
            <span className="e" hidden={!(errors.items && cart.length === 0)}>
              Dodajte bar jedan proizvod u upit.
            </span>
            {serverError && <span className="e">{serverError}</span>}
            <button type="submit" className="btn accent" disabled={status.kind === "sending"}>
              {status.kind === "sending" ? "Šaljem…" : "Pošalji upit"}
            </button>
            <span className="hint">Slanjem upita ništa ne plaćate. Javljamo vam se sa ponudom.</span>
          </form>
        </div>

        {done && (
          <div className="done">
            <h3>
              Upit {done.ref} {done.sent ? "je poslat" : "je pripremljen"}
            </h3>
            <p>
              {done.sent
                ? "Hvala! Upit je stigao do nas. Javljamo vam se sa ponudom i rokom izrade."
                : "Ovo je demo prikaz, pa upit nije poslat firmi. Na pravom sajtu on stiže na email i telefon firme, a kupac dobija potvrdu."}
            </p>
            <pre ref={preRef}>{done.text}</pre>
            <div className="hero-cta">
              <button type="button" className="btn sm" onClick={() => copy(done.text)}>
                {copyLabel}
              </button>
              <button type="button" className="btn sm ghost" onClick={reset}>
                Novi upit
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
