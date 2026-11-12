"use client";

import { useEffect, useState } from "react";
import { Drawing } from "./Drawing";
import { useStore } from "./StoreProvider";
import { COLORS, DIM_LABELS, TYPES, clamp, describe, roundUp5, type DimKey, type PanelColor, type ProductType } from "@/lib/data";

/** Brojčano polje koje dozvoljava slobodno kucanje, a vrednost ograničava tek na blur/Enter. */
function NumField({
  id,
  value,
  min,
  max,
  onCommit,
}: {
  id: string;
  value: number;
  min: number;
  max: number;
  onCommit: (v: number) => void;
}) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  const commit = () => {
    const v = clamp(draft, min, max);
    setDraft(String(v));
    onCommit(v);
  };
  return (
    <span className="num">
      <input
        type="number"
        id={id}
        min={min}
        max={max}
        inputMode="numeric"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), commit())}
      />
      <i>cm</i>
    </span>
  );
}

export function Configurator() {
  const { cfg, setCfg, addToCart } = useStore();
  const [dogL, setDogL] = useState("");
  const [dogH, setDogH] = useState("");
  const [dogMsg, setDogMsg] = useState(
    "Dužinu merite od njuške do korena repa. Preporuka je orijentaciona, konačne mere potvrđujemo sa vama.",
  );

  const isHouse = cfg.type === "kucica";
  const t = TYPES[cfg.type];
  const d = describe(cfg);

  const setType = (type: ProductType) => {
    const [L, W, H] = TYPES[type].d;
    setCfg((c) => ({ ...c, type, L, W, H }));
  };
  const setDim = (k: DimKey, v: number) => setCfg((c) => ({ ...c, [k]: v }));

  const applyDog = () => {
    const l = Number(dogL), h = Number(dogH);
    if (!(l >= 20 && h >= 15)) {
      setDogMsg("Upišite obe mere psa u centimetrima.");
      return;
    }
    const T = TYPES.kucica;
    const L = clamp(roundUp5(l * 1.25), ...T.L);
    const W = clamp(roundUp5(l * 0.9), ...T.W);
    const H = clamp(roundUp5(h * 1.25), ...T.H);
    setCfg((c) => ({ ...c, L, W, H }));
    setDogMsg(`Preporuka: ${L} × ${W} × ${H} cm. Orijentaciono, konačne mere potvrđujemo sa vama.`);
  };

  return (
    <section className="sec" id="konfigurator">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">Konfigurator</span>
          <h2>Složite je sami</h2>
          <p className="lead">
            Menjajte mere i gledajte kako se skica menja. Kad ste zadovoljni, dodajte je u upit i dobićete ponudu sa cenom.
          </p>
        </div>

        <div className="cfg">
          <div className="sheet">
            <div role="img" aria-label="Skica proizvoda sa merama">
              <Drawing cfg={cfg} />
            </div>
            <div className="chips">
              {[d.title, ...d.attrs].map((x) => (
                <span key={x}>{x}</span>
              ))}
            </div>
          </div>

          <div className="ctl">
            <fieldset>
              <legend>Šta vam treba</legend>
              <div className="seg">
                {(Object.keys(TYPES) as ProductType[]).map((k) => (
                  <label key={k}>
                    <input type="radio" name="type" value={k} checked={cfg.type === k} onChange={() => setType(k)} />
                    <span>{TYPES[k].name}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend>Mere</legend>
              {isHouse && (
                <div className="presets">
                  {[
                    [100, 60, 80],
                    [100, 75, 90],
                  ].map(([L, W, H]) => (
                    <button key={`${L}${W}${H}`} type="button" className="chipbtn" onClick={() => setCfg((c) => ({ ...c, L, W, H }))}>
                      {L} × {W} × {H}
                    </button>
                  ))}
                </div>
              )}
              <div>
                {(Object.keys(DIM_LABELS) as DimKey[]).map((k) => {
                  const [mn, mx] = t[k];
                  return (
                    <div className="dim" key={k}>
                      <label htmlFor={`n${k}`}>{DIM_LABELS[k]}</label>
                      <input
                        type="range"
                        min={mn}
                        max={mx}
                        step={5}
                        value={cfg[k]}
                        aria-label={`${DIM_LABELS[k]} u centimetrima`}
                        onChange={(e) => setDim(k, Number(e.target.value))}
                      />
                      <NumField id={`n${k}`} value={cfg[k]} min={mn} max={mx} onCommit={(v) => setDim(k, v)} />
                    </div>
                  );
                })}
              </div>
              {isHouse && (
                <details className="help">
                  <summary>Ne znate koju veličinu? Unesite mere psa</summary>
                  <div className="pair">
                    <div>
                      <label htmlFor="dogL">Dužina psa</label>
                      <span className="num">
                        <input type="number" id="dogL" min={20} max={160} placeholder="80" inputMode="numeric" value={dogL} onChange={(e) => setDogL(e.target.value)} />
                        <i>cm</i>
                      </span>
                    </div>
                    <div>
                      <label htmlFor="dogH">Visina do vrha glave</label>
                      <span className="num">
                        <input type="number" id="dogH" min={15} max={130} placeholder="70" inputMode="numeric" value={dogH} onChange={(e) => setDogH(e.target.value)} />
                        <i>cm</i>
                      </span>
                    </div>
                    <button type="button" className="btn sm ghost" onClick={applyDog}>
                      Primeni preporuku
                    </button>
                  </div>
                  <p className="hint" style={{ marginTop: 10 }}>
                    {dogMsg}
                  </p>
                </details>
              )}
            </fieldset>

            {isHouse && (
              <fieldset>
                <legend>Ulaz</legend>
                <div className="presets">
                  {[
                    [25, 35],
                    [30, 35],
                  ].map(([dw, dh]) => (
                    <button key={`${dw}${dh}`} type="button" className="chipbtn" onClick={() => setCfg((c) => ({ ...c, dw, dh }))}>
                      {dw} × {dh}
                    </button>
                  ))}
                </div>
                <div className="pair">
                  <div>
                    <label htmlFor="dw">Širina ulaza</label>
                    <NumField id="dw" value={cfg.dw} min={15} max={80} onCommit={(v) => setCfg((c) => ({ ...c, dw: v }))} />
                  </div>
                  <div>
                    <label htmlFor="dh">Visina ulaza</label>
                    <NumField id="dh" value={cfg.dh} min={20} max={100} onCommit={(v) => setCfg((c) => ({ ...c, dh: v }))} />
                  </div>
                </div>
              </fieldset>
            )}

            <fieldset>
              <legend>Boja panela</legend>
              <div className="seg">
                {(Object.keys(COLORS) as PanelColor[]).map((k) => (
                  <label key={k}>
                    <input type="radio" name="color" value={k} checked={cfg.color === k} onChange={() => setCfg((c) => ({ ...c, color: k }))} />
                    <span>
                      <i className="sw" style={{ backgroundImage: `url(${COLORS[k].swatch})` }} />
                      {COLORS[k].name}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {cfg.type !== "boks" && (
              <fieldset>
                <legend>Dodaci</legend>
                <label className="check">
                  <input type="checkbox" checked={cfg.lid} onChange={(e) => setCfg((c) => ({ ...c, lid: e.target.checked }))} />
                  <span>
                    <b>Krov na otvaranje</b>
                    <br />
                    <span className="hint">Podiže se i oslanja na nosač, za lakše čišćenje.</span>
                  </span>
                </label>
                {isHouse && (
                  <label className="check">
                    <input type="checkbox" checked={cfg.hall} onChange={(e) => setCfg((c) => ({ ...c, hall: e.target.checked }))} />
                    <span>
                      <b>Pregrada sa predsobljem</b>
                      <br />
                      <span className="hint">Unutrašnji zid sa prolazom deli ulaz od ležaja.</span>
                    </span>
                  </label>
                )}
              </fieldset>
            )}

            <div className="addrow">
              <div className="qty" role="group" aria-label="Količina">
                <button type="button" aria-label="Manje" onClick={() => setCfg((c) => ({ ...c, qty: Math.max(1, c.qty - 1) }))}>
                  −
                </button>
                <output>{cfg.qty}</output>
                <button type="button" aria-label="Više" onClick={() => setCfg((c) => ({ ...c, qty: Math.min(20, c.qty + 1) }))}>
                  +
                </button>
              </div>
              <button
                type="button"
                className="btn accent"
                onClick={() => {
                  addToCart(cfg);
                  setCfg((c) => ({ ...c, qty: 1 }));
                }}
              >
                Dodaj u upit
              </button>
              <span className="hint">Cenu dobijate u ponudi.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
