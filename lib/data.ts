export type ProductType = "kucica" | "boks" | "combo";
export type PanelColor = "antracit" | "bela" | "drvo";
export type DimKey = "L" | "W" | "H";

export interface Config {
  type: ProductType;
  L: number;
  W: number;
  H: number;
  dw: number;
  dh: number;
  color: PanelColor;
  lid: boolean;
  hall: boolean;
  qty: number;
}

export interface CartItem extends Config {
  id: string;
}

export const TYPES: Record<
  ProductType,
  { name: string; L: [number, number]; W: [number, number]; H: [number, number]; d: [number, number, number] }
> = {
  kucica: { name: "Kućica", L: [60, 250], W: [50, 200], H: [50, 160], d: [100, 75, 90] },
  boks: { name: "Boks", L: [100, 600], W: [100, 400], H: [120, 250], d: [200, 150, 180] },
  combo: { name: "Boks sa kućicom", L: [150, 600], W: [100, 400], H: [120, 250], d: [250, 150, 180] },
};

export const COLORS: Record<PanelColor, { name: string; fill: string; rib: string; horizontal: boolean; swatch: string }> = {
  antracit: { name: "Antracit", fill: "#3a4049", rib: "#2b3037", horizontal: false, swatch: "/img/panel-antracit.jpg" },
  bela: { name: "Bela", fill: "#e6e8e4", rib: "#c5c9c3", horizontal: false, swatch: "/img/panel-bela.jpg" },
  drvo: { name: "Dekor drveta", fill: "#8a5937", rib: "#6c4327", horizontal: true, swatch: "/img/panel-drvo.jpg" },
};

export const DIM_LABELS: Record<DimKey, string> = { L: "Dužina", W: "Širina", H: "Visina" };

export const DEFAULT_CONFIG: Config = {
  type: "kucica",
  L: 100,
  W: 75,
  H: 90,
  dw: 30,
  dh: 35,
  color: "antracit",
  lid: true,
  hall: false,
  qty: 1,
};

export interface Model {
  img: string;
  title: string;
  text: string;
  config: Omit<Config, "qty">;
}

export const MODELS: Model[] = [
  {
    img: "/img/model-antracit.jpg",
    title: "Kućica antracit",
    text: "Polazne mere 100 × 60 × 80 cm, ulaz 25 × 35 cm. Krov na otvaranje.",
    config: { type: "kucica", L: 100, W: 60, H: 80, dw: 25, dh: 35, color: "antracit", lid: true, hall: false },
  },
  {
    img: "/img/model-drvo.jpg",
    title: "Kućica dekor drveta",
    text: "Panel sa šarom drveta i svetlim lajsnama. Polazne mere 100 × 75 × 90 cm.",
    config: { type: "kucica", L: 100, W: 75, H: 90, dw: 30, dh: 35, color: "drvo", lid: true, hall: false },
  },
  {
    img: "/img/model-bela.jpg",
    title: "Kućica bela",
    text: "Beli panel sa tamnim lajsnama, za veće pse. Mere birate sami.",
    config: { type: "kucica", L: 100, W: 100, H: 110, dw: 35, dh: 50, color: "bela", lid: true, hall: false },
  },
  {
    img: "/img/model-predsoblje.jpg",
    title: "Kućica sa predsobljem",
    text: "Pregrada deli ulaz od ležaja, pa vetar ne duva direktno na psa.",
    config: { type: "kucica", L: 160, W: 100, H: 90, dw: 30, dh: 35, color: "bela", lid: true, hall: true },
  },
  {
    img: "/img/model-boks.jpg",
    title: "Boks sa kućicom",
    text: "Mrežasti boks sa krovom i ugrađenom kućicom, po vašim merama.",
    config: { type: "combo", L: 250, W: 150, H: 180, dw: 30, dh: 35, color: "drvo", lid: true, hall: false },
  },
];

export const clamp = (v: number | string, min: number, max: number) =>
  Math.min(max, Math.max(min, Math.round(Number(v)) || min));

export const roundUp5 = (v: number) => Math.ceil(v / 5) * 5;

export function describe(it: Config) {
  const attrs = [`${it.L} × ${it.W} × ${it.H} cm`, `panel: ${COLORS[it.color].name.toLowerCase()}`];
  if (it.type === "kucica") attrs.push(`ulaz ${it.dw} × ${it.dh} cm`);
  if (it.type !== "boks" && it.lid) attrs.push("krov na otvaranje");
  if (it.type === "kucica" && it.hall) attrs.push("pregrada sa predsobljem");
  return { title: TYPES[it.type].name, attrs };
}

/** Proverava i čisti stavku koja stiže spolja (localStorage ili API). */
export function sanitizeItem(raw: unknown): Config | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const type = r.type as ProductType;
  const color = r.color as PanelColor;
  if (!(type in TYPES) || !(color in COLORS)) return null;
  const t = TYPES[type];
  return {
    type,
    color,
    L: clamp(r.L as number, ...t.L),
    W: clamp(r.W as number, ...t.W),
    H: clamp(r.H as number, ...t.H),
    dw: clamp(r.dw as number, 15, 80),
    dh: clamp(r.dh as number, 20, 100),
    lid: Boolean(r.lid),
    hall: Boolean(r.hall),
    qty: clamp(r.qty as number, 1, 20),
  };
}

export interface InquiryContact {
  name: string;
  phone: string;
  email?: string;
  shipping: string;
  address?: string;
  payment: string;
  note?: string;
}

export function inquiryText(ref: string, items: Config[], c: InquiryContact) {
  const lines = [`Upit br. ${ref}`, ""];
  items.forEach((it, i) => {
    const d = describe(it);
    lines.push(`${i + 1}) ${d.title}, ${it.qty} kom`, `   ${d.attrs.join(", ")}`);
  });
  lines.push("", `Ime: ${c.name}`, `Telefon: ${c.phone}`);
  if (c.email) lines.push(`Email: ${c.email}`);
  lines.push(`Preuzimanje: ${c.shipping}`);
  if (c.address) lines.push(`Adresa: ${c.address}`);
  lines.push(`Plaćanje: ${c.payment}`);
  if (c.note) lines.push(`Napomena: ${c.note}`);
  return lines.join("\n");
}

export const CONTACT = {
  phone: "+381 69 6188 96",
  phoneHref: "tel:+38169618896",
  email: "s.v.samovar@gmail.com",
  address: "Milana Atlagića 1A, 21413 Čelarevo",
  instagram: "https://www.instagram.com/samovar_s.v/",
  instagramHandle: "@samovar_s.v",
};
