# SamoVar — Next.js sajt

Sajt za SamoVar (samovar_s.v), kućice i boksevi za pse od sendvič panela, Čelarevo.
Next.js 15 (App Router) + React 19 + TypeScript. Bez dodatnih UI biblioteka.

## Pokretanje

```bash
npm install
cp .env.example .env.local
npm run dev          # http://localhost:3000
```

Produkcija: `npm run build` pa `npm start`, ili samo povežite repozitorijum sa Vercel-om.

## Struktura

```
app/
  layout.tsx         fontovi (lokalno, @fontsource), SEO metapodaci
  page.tsx           sve sekcije: hero, izrada, koraci, FAQ, kontakt
  globals.css        ceo dizajn (svetla i tamna tema)
  api/upit/route.ts  prijem upita, provera podataka, slanje emaila
  robots.ts, sitemap.ts
components/
  StoreProvider.tsx  stanje: konfigurator, korpa upita (localStorage), toast
  Configurator.tsx   izbor proizvoda, mera, ulaza, boje, dodataka, preporuka po merama psa
  Drawing.tsx        živa SVG skica sa kotama
  Models.tsx         gotovi modeli ("Prilagodi" / "Dodaj u upit")
  Inquiry.tsx        lista upita i forma
lib/data.ts          tipovi, modeli, opsezi mera, boje, kontakt, tekst upita
public/img/          fotografije i teksture panela
```

Najčešće izmene se rade u `lib/data.ts`: modeli, opsezi mera po tipu, boje panela i kontakt podaci.

## Demo i pravi režim

| `.env.local` | Ponašanje |
|---|---|
| `NEXT_PUBLIC_DEMO=true` (podrazumevano) | Demo traka na vrhu, upit se ne šalje, kupac vidi tekst upita. Sajt se ne indeksira (robots.txt). |
| `NEXT_PUBLIC_DEMO=false` + `RESEND_API_KEY` + `INQUIRY_TO` | Upit stiže na email firme, kupac dobija potvrdu. Sajt je otvoren za Google. |

### Podešavanje slanja emaila (Resend)

1. Napravite nalog na resend.com i verifikujte domen (npr. samovar.rs).
2. U `.env.local` (ili Vercel → Settings → Environment Variables) upišite:
   - `RESEND_API_KEY` — ključ iz Resend-a
   - `INQUIRY_TO` — email firme (može više, odvojeno zarezom)
   - `INQUIRY_FROM` — pošiljalac sa verifikovanog domena, npr. `SamoVar sajt <upit@samovar.rs>`
   - `NEXT_PUBLIC_DEMO=false`
   - `NEXT_PUBLIC_SITE_URL` — prava adresa sajta
3. Ponovo pokrenite build/deploy.

Ako kupac ostavi email, odgovor na poruku firme ide direktno njemu (reply-to).

## Napomene

- Cene se ne prikazuju: kupac složi proizvod i šalje upit za ponudu.
- Plaćanje: pouzećem ili uplatom na račun (navodi se u upitu, ne naplaćuje se na sajtu).
- Server ponovo proverava i ograničava sve vrednosti iz upita (mere, količine, dužine polja).
