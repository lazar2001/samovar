"use client";

import Image from "next/image";
import { MODELS } from "@/lib/data";
import { useStore } from "./StoreProvider";

export function Models() {
  const { setCfg, addToCart } = useStore();

  return (
    <section className="sec band" id="modeli">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">Modeli</span>
          <h2>Već napravljeno</h2>
          <p className="lead">Krenite od modela koji vam se dopada, pa mu promenite mere ili boju.</p>
        </div>
        <div className="models">
          {MODELS.map((m) => (
            <article className="model" key={m.title}>
              <Image src={m.img} alt={m.title} width={640} height={600} sizes="(max-width:560px) 100vw, (max-width:900px) 50vw, 380px" />
              <div className="b">
                <h3>{m.title}</h3>
                <p>{m.text}</p>
                <div className="acts">
                  <button
                    type="button"
                    className="btn sm"
                    onClick={() => {
                      setCfg({ ...m.config, qty: 1 });
                      document.getElementById("konfigurator")?.scrollIntoView();
                    }}
                  >
                    Prilagodi
                  </button>
                  <button type="button" className="btn sm ghost" onClick={() => addToCart({ ...m.config, qty: 1 })}>
                    Dodaj u upit
                  </button>
                </div>
              </div>
            </article>
          ))}
          <article className="model custom">
            <div className="b">
              <h3>Nešto po vašoj meri</h3>
              <p>Nijedan model ne odgovara? Unesite svoje mere u konfigurator ili opišite šta vam treba u napomeni upita.</p>
              <div className="acts">
                <a className="btn sm accent" href="#konfigurator">
                  Otvori konfigurator
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
