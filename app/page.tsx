import Image from "next/image";
import { CartButton, StoreProvider } from "@/components/StoreProvider";
import { Configurator } from "@/components/Configurator";
import { Models } from "@/components/Models";
import { Inquiry } from "@/components/Inquiry";
import { CONTACT } from "@/lib/data";

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO !== "false";

const FAQ = [
  ["Koliko košta kućica?", "Cena zavisi od mera, boje panela i dodataka. Složite kućicu u konfiguratoru i pošaljite upit, a mi vam javljamo ponudu sa cenom i rokom izrade."],
  ["Kako se plaća?", "Pouzećem prilikom preuzimanja ili uplatom na račun. Podatke za uplatu dobijate uz ponudu."],
  ["Da li dostavljate?", "Da, vršimo dostavu na adresu. Cenu i termin dostave navodimo u ponudi. Kućicu možete preuzeti i lično u Čelarevu."],
  ["Koju veličinu da izaberem?", "Pas treba da može da uđe, okrene se i legne ispružen. U konfiguratoru unesite mere psa i dobićete orijentacionu preporuku. Konačne mere potvrđujemo sa vama pre izrade."],
  ["Kako se kućica čisti?", "Krov se otvara i ostaje podignut na nosaču, pa je unutrašnjost dostupna cela. Površine panela se brišu vlažnom krpom."],
  ["Pravite li bokseve po meri?", "Da. Boks radimo po vašim merama, sa kućicom ili bez nje."],
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "SamoVar",
  description: "Kućice i boksevi za pse od sendvič panela, po meri.",
  telephone: CONTACT.phone,
  email: CONTACT.email,
  address: { "@type": "PostalAddress", streetAddress: "Milana Atlagića 1A", postalCode: "21413", addressLocality: "Čelarevo", addressCountry: "RS" },
  sameAs: [CONTACT.instagram],
};

export default function Home() {
  return (
    <StoreProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {IS_DEMO && (
        <div className="demo">
          <div className="wrap">Demo prikaz sajta. Upiti se u ovoj verziji ne šalju firmi.</div>
        </div>
      )}

      <header className="top">
        <div className="wrap top-in">
          <a className="brand" href="#pocetak" aria-label="SamoVar, početak">
            <b>S</b>amo<b>V</b>ar
          </a>
          <nav className="nav" aria-label="Glavna navigacija">
            <a href="#konfigurator">Konfigurator</a>
            <a href="#modeli">Modeli</a>
            <a href="#izrada">Izrada</a>
            <a href="#pitanja">Pitanja</a>
            <a href="#kontakt">Kontakt</a>
          </nav>
          <CartButton />
        </div>
      </header>

      <main>
        <section className="hero" id="pocetak">
          <div className="wrap">
            <div className="hero-in">
              <div className="hero-txt">
                <span className="eyebrow">Kućice i boksevi za pse · Čelarevo</span>
                <h1>Topla kućica po meri vašeg psa</h1>
                <p className="lead">
                  Pravimo kućice i bokseve od sendvič panela. Vi birate mere, boju panela i dodatke, a mi izrađujemo i dostavljamo na adresu.
                </p>
                <div className="hero-cta">
                  <a className="btn accent" href="#konfigurator">Složite svoju kućicu</a>
                  <a className="btn ghost" href="#modeli">Pogledajte modele</a>
                </div>
              </div>
              <div className="hero-img">
                <Image
                  src="/img/hero.jpg"
                  alt="Tri antracit kućice za pse sa podignutim krovovima, različitih veličina"
                  width={818}
                  height={741}
                  priority
                  sizes="(max-width:820px) 100vw, 540px"
                />
              </div>
            </div>
            <dl className="facts">
              <div><dt>Mere</dt><dd>Po vašoj želji</dd></div>
              <div><dt>Paneli</dt><dd>Antracit, bela, dekor drveta</dd></div>
              <div><dt>Krov</dt><dd>Na otvaranje</dd></div>
              <div><dt>Isporuka</dt><dd>Dostava na adresu</dd></div>
            </dl>
          </div>
        </section>

        <Configurator />
        <Models />

        <section className="sec" id="izrada">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">Izrada</span>
              <h2>Zašto sendvič panel</h2>
            </div>
            <div className="why">
              <div className="why-img">
                <Image src="/img/izrada-unutrasnjost.jpg" alt="Unutrašnjost kućice od belog panela sa podignutim krovom" width={640} height={640} sizes="(max-width:820px) 50vw, 260px" />
                <Image src="/img/izrada-krov.jpg" alt="Krov kućice podignut i oslonjen na metalni nosač" width={640} height={640} sizes="(max-width:820px) 50vw, 260px" />
              </div>
              <dl>
                <div><dt>Izolacija u zidu</dt><dd>Panel ima izolaciono jezgro između dve obloge. Zidovi, pod i krov zimi čuvaju toplotu, a leti usporavaju pregrevanje.</dd></div>
                <div><dt>Krov na otvaranje</dt><dd>Krov se podiže i oslanja na nosač, pa je cela unutrašnjost dostupna za čišćenje i menjanje prostirke.</dd></div>
                <div><dt>Metalne lajsne</dt><dd>Sve ivice zatvorene su metalnim profilima koji štite panel i drže konstrukciju čvrstom.</dd></div>
                <div><dt>Podignuta od tla</dt><dd>Kućica stoji na nožicama, pa pod nije u dodiru sa vlažnom zemljom.</dd></div>
              </dl>
            </div>
          </div>
        </section>

        <section className="sec band">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">Poručivanje</span>
              <h2>Od skice do dvorišta</h2>
            </div>
            <ol className="steps">
              <li><h3>Složite</h3><p>U konfiguratoru izaberite proizvod, mere, boju panela i dodatke.</p></li>
              <li><h3>Pošaljite upit</h3><p>Ostavite ime i telefon. Upit vas ni na šta ne obavezuje.</p></li>
              <li><h3>Dobijate ponudu</h3><p>Javljamo cenu i rok izrade i potvrđujemo mere sa vama.</p></li>
              <li><h3>Plaćanje i isporuka</h3><p>Plaćate pouzećem ili uplatom na račun. Dostavljamo na adresu ili preuzimate u Čelarevu.</p></li>
            </ol>
          </div>
        </section>

        <section className="sec" id="pitanja">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">Pitanja</span>
              <h2>Najčešća pitanja</h2>
            </div>
            <div className="faq">
              {FAQ.map(([q, a]) => (
                <details key={q}>
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <Inquiry />

        <section className="sec" id="kontakt">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">Kontakt</span>
              <h2>Javite nam se</h2>
            </div>
            <div className="contact">
              <div><span className="eyebrow">Telefon</span><a className="v" href={CONTACT.phoneHref}>{CONTACT.phone}</a></div>
              <div><span className="eyebrow">Email</span><a className="v" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></div>
              <div><span className="eyebrow">Radionica</span><span className="v">{CONTACT.address}</span></div>
              <div><span className="eyebrow">Instagram</span><a className="v" href={CONTACT.instagram} target="_blank" rel="noopener">{CONTACT.instagramHandle}</a></div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">SamoVar · Kućice i boksevi za pse od sendvič panela · Čelarevo</div>
      </footer>
    </StoreProvider>
  );
}
