import { useEffect, useMemo, useRef, useState } from "react";
import WireframeDottedGlobe from "./components/ui/WireframeDottedGlobe";
import { useHomeMotion } from "./useHomeMotion";
import { useInternalMotion } from "./useInternalMotion";
import {
  consortiumPartners,
  ecosystemChapters,
  euFunding,
  events,
  faqGroups,
  founderSupport,
  homeSectors,
  investmentCriteria,
  metrics,
  news,
  portfolio,
  processSteps,
  resourceNews,
  strategicPartners,
  team,
  technologyPartners,
  testimonials,
  thesisAreas,
} from "./data";

const navItems = [
  ["Team", "/team"],
  ["Partners", "/partners"],
  ["Thesis", "/thesis"],
  ["Newsroom", "/newsroom"],
  ["Events", "/events"],
  ["FAQ", "/faq"],
];

const editorialImages = [
  "/assets/odra-editorial-yellow.webp",
  "/assets/odra-editorial-lavender.webp",
  "/assets/odra-editorial-mint.webp",
];

function Icon({ name, className = "" }) {
  return <img className={`icon ${className}`} src={`/assets/icons/${name}.svg`} alt="" aria-hidden="true" />;
}

function SocialIcon({ name }) {
  if (name === "linkedin") {
    return (
      <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04s-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
      </svg>
    );
  }

  if (name === "x") {
    return (
      <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.24 2.25h3.31l-7.23 8.26 8.51 11.24h-6.66l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.84L7.08 4.13H5.12l11.96 15.64Z" />
      </svg>
    );
  }

  return (
    <svg className="social-icon social-icon-mail" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function ArrowLink({ href, children, light = false, className = "" }) {
  return (
    <a className={`arrow-link ${light ? "light" : ""} ${className}`} href={href}>
      <span>{children}</span><Icon name="arrow-right" />
    </a>
  );
}

function ButtonLink({ href, children, secondary = false, className = "" }) {
  return (
    <a className={`button ${secondary ? "button-secondary" : "button-primary"} ${className}`} href={href}>
      <span>{children}</span><Icon name={secondary ? "chevron-right" : "arrow-right"} />
    </a>
  );
}

function TechnologyPartnerCell({ partner }) {
  return (
    <div className={partner.logo ? "" : "text-only"}>
      {partner.logo && <img src={partner.logo} alt={partner.name} loading="lazy" decoding="async" />}
      <span>{partner.name}</span>
    </div>
  );
}

function PortfolioCard({ company, index, wide = false }) {
  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty("--preview-x", `${x * -18}px`);
    event.currentTarget.style.setProperty("--preview-y", `${y * -12}px`);
    event.currentTarget.style.setProperty("--card-rotate-x", `${y * -2.4}deg`);
    event.currentTarget.style.setProperty("--card-rotate-y", `${x * 2.4}deg`);
  };

  const handlePointerLeave = (event) => {
    event.currentTarget.style.setProperty("--preview-x", "0px");
    event.currentTarget.style.setProperty("--preview-y", "0px");
    event.currentTarget.style.setProperty("--card-rotate-x", "0deg");
    event.currentTarget.style.setProperty("--card-rotate-y", "0deg");
  };

  return (
    <a
      className={`portfolio-card ${company.tone} ${wide ? "wide" : ""}`}
      href={company.href}
      target="_blank"
      rel="noreferrer"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-label={`Visit ${company.name} website`}
    >
      <div className="portfolio-preview" aria-hidden="true">
        <img src={company.image} alt="" loading="lazy" decoding="async" style={{ objectPosition: company.imagePosition || "center top" }} />
      </div>
      <span className="portfolio-scrim" aria-hidden="true" />
      <span className="portfolio-index">{String(index + 1).padStart(2, "0")}</span>
      <div className="portfolio-copy"><h3>{company.name}</h3><p>{company.sector}</p></div>
      <span className="round-arrow"><Icon name="arrow-up-right" /></span>
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const pathname = window.location.pathname;
  useEffect(() => setOpen(false), [pathname]);
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Odra Venture home">
        <img src="/assets/odra-ventures-logo.png" alt="Odra Venture" />
      </a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map(([label, href]) => <a key={href} className={pathname === href ? "active" : ""} href={href}>{label}</a>)}
      </nav>
      <a className="header-apply" href="/apply">Apply <Icon name="arrow-up-right" /></a>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation">
        <Icon name="menu" />
      </button>
      <div className={`mobile-nav ${open ? "open" : ""}`}>
        {navItems.map(([label, href], i) => <a key={href} href={href}><span>0{i + 1}</span>{label}</a>)}
        <a className="mobile-apply" href="/apply">Start an application <Icon name="arrow-right" /></a>
      </div>
    </header>
  );
}

function Newsletter({ compact = false }) {
  const [message, setMessage] = useState("");
  function submit(event) {
    event.preventDefault();
    setMessage("Thank you — you're on the list.");
    event.currentTarget.reset();
  }
  return (
    <form className={`newsletter ${compact ? "compact" : ""}`} onSubmit={submit}>
      <label className="sr-only" htmlFor={compact ? "footer-email" : "newsletter-email"}>Email address</label>
      <input id={compact ? "footer-email" : "newsletter-email"} type="email" required placeholder={compact ? "Your email" : "you@startup.com"} />
      <button type="submit">{compact ? "Join" : "Subscribe"}<Icon name="arrow-right" /></button>
      {message && <span className="form-message" role="status">{message}</span>}
    </form>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-newsletter">
        <div><p className="eyebrow light">Stay in the loop</p><h2>Join 5,000+ founders getting weekly ecosystem insights.</h2></div>
        <Newsletter compact />
      </div>
      <div className="footer-grid">
        <div className="footer-brand">
          <img src="/assets/odra-ventures-logo.png" alt="Odra Venture" />
          <p>Backing Europe's next generation of ambitious founders building category-defining companies.</p>
          <div className="socials" aria-label="Odra Venture social links">
            <a href="https://linkedin.com/company/odra-venture" target="_blank" rel="noreferrer" aria-label="Odra Venture on LinkedIn" title="LinkedIn"><SocialIcon name="linkedin" /></a>
            <a href="https://twitter.com/OdraVenture" target="_blank" rel="noreferrer" aria-label="Odra Venture on X" title="X"><SocialIcon name="x" /></a>
            <a href="mailto:hello@odraventure.com" aria-label="Email Odra Venture" title="Email"><SocialIcon name="mail" /></a>
          </div>
        </div>
        <div><h3>Company</h3><a href="/team">Team</a><a href="/thesis">Thesis</a><a href="/partners">Partners</a><a href="/process">Process</a><a href="/apply">Apply</a><a href="/contact">Contact</a></div>
        <div><h3>Resources</h3><a href="/newsroom">Newsroom</a><a href="/events">Events</a><a href="/faq">FAQ</a><a href="/resources">Resources</a><a href="/press">Press Kit</a></div>
        <div><h3>Legal</h3><a href="/legal#privacy">Privacy Policy</a><a href="/legal#terms">Terms of Service</a><a href="/legal#disclaimer">Disclaimer</a></div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Odra Venture Sp. z o.o. All rights reserved.</span>
        <span>KRS: 0001225642 · NIP: 1133194972 · REGON: 544050560</span>
        <span>Odra Venture does not operate as a registered investment fund. Acceleration and technology grant decisions are made on a case-by-case basis.</span>
      </div>
    </footer>
  );
}

function CookieNotice() {
  const [visible, setVisible] = useState(() => localStorage.getItem("odra-cookie-choice") == null);
  if (!visible) return null;
  const choose = (choice) => { localStorage.setItem("odra-cookie-choice", choice); setVisible(false); };
  return (
    <aside className="cookie-notice" aria-label="Cookie preferences">
      <p>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies. <a href="/legal">Learn more</a></p>
      <div><button onClick={() => choose("decline")}>Decline</button><button className="accept" onClick={() => choose("accept")}>Accept</button></div>
    </aside>
  );
}

function SectionHeading({ eyebrow, title, intro, action }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <div><h2>{title}</h2>{intro && <p>{intro}</p>}</div>
      {action && <ArrowLink href={action.href}>{action.label}</ArrowLink>}
    </div>
  );
}

function MetricGrid({ items = metrics, dark = false }) {
  return <div className={`metric-grid ${dark ? "dark" : ""}`}>{items.map((item) => <article key={`${item.value}-${item.label}`}><strong data-count-value={item.value}>{item.value}</strong><span>{item.label}</span></article>)}</div>;
}

function SectorFocusVisual({ sector, index }) {
  return (
    <aside className={`sector-focus-visual ${sector.visual}`} id="sector-focus-visual" aria-live="polite">
      <div className="sector-visual-media">
        <img src={sector.image} alt="" aria-hidden="true" loading="lazy" decoding="async" style={{ objectPosition: sector.imagePosition }} />
        <div className="sector-visual-topline"><span>0{index + 1} / Investment focus</span><strong>{sector.value}</strong></div>
        <span className="sector-visual-link"><Icon name="arrow-up-right" /></span>
      </div>
      <div className="sector-visual-copy" key={sector.title}>
        <span>Where conviction compounds</span>
        <h3>{sector.title}</h3>
        <p>{sector.body}</p>
        <div>{sector.chips.map((chip) => <span key={chip}>{chip}</span>)}</div>
      </div>
    </aside>
  );
}

function HomePage() {
  const [activeSector, setActiveSector] = useState(0);
  const motionScope = useRef(null);
  const homepagePortfolio = portfolio.filter((company) => ["TopSpots", "CogStorm", "GridVoltX", "CarbVault"].includes(company.name));
  const homepageConsortium = consortiumPartners.filter((partner) => ["VO2 Ventures", "Space Bridge Fund", "DGA S.A.", "Adlytica"].includes(partner.name));
  const selectSector = (index) => setActiveSector(index);
  useHomeMotion(motionScope);

  return (
    <>
      <main className="home-page" ref={motionScope}>
        <div className="home-scroll-progress" aria-hidden="true"><span /></div>
        <section className="home-hero">
          <div className="hero-copy">
            <span className="status"><i />Now accepting applications</span>
            <h1>We back Europe's most ambitious founders</h1>
            <p>Capital, networks, and hands-on support to help you build a category-defining company.</p>
            <div className="hero-actions"><ButtonLink href="/apply">Apply Now</ButtonLink><ButtonLink href="/thesis" secondary>Our Investment Thesis</ButtonLink></div>
            <div className="hero-footnote"><span>Venture Platform</span><span>Warszawa & Wrocław</span></div>
          </div>
          <figure className="hero-visual hero-architecture">
            <img src="/assets/odra-architectural-hero.webp" alt="Pastel architectural arch representing an open path for ambitious founders" decoding="async" fetchPriority="high" />
          </figure>
        </section>

        <section className="news-strip">
          <div><Icon name="newspaper" /><p><span>Newsroom</span>Portfolio funding notes are now live, with matching startup-side announcements across the sites we support.</p></div>
          <ArrowLink href="/newsroom">Visit the newsroom</ArrowLink>
        </section>

        <section className="proof-section section-pad">
          <SectionHeading eyebrow="Odra Venture Sp. z o.o." title="Venture Platform" intro="Warszawa & Wrocław · KRS 0001225642 · NIP 1133194972" />
          <MetricGrid />
        </section>

        <section className="support-section section-pad">
          <SectionHeading eyebrow="02 / Founder support" title="How we help founders win" intro="More than capital. We're operators who've built and scaled companies, and we bring that experience to every founder we back." />
          <div className="support-grid">
            {founderSupport.map((item) => (
              <article className={`support-card ${item.tone}`} key={item.title} tabIndex="0">
                <div className="support-top"><span>{item.number}</span><span className="icon-box"><Icon name={item.icon} /></span></div>
                <div><h3>{item.title}</h3><p>{item.body}</p></div>
                <ul>{item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
                <span className="round-arrow"><Icon name="arrow-right" /></span>
              </article>
            ))}
          </div>
        </section>

        <section className="alliances-section section-pad dark-section">
          <SectionHeading eyebrow="03 / Strategic alliances" title="Official partner of the world's leading technology programs" intro="Our founders inherit our partner status from day one — direct access to credits, technical support, and go-to-market resources from NVIDIA, AWS, Google, IBM, Oracle, Anthropic, Ramp, and Lovable." />
          <div className="alliances-grid">
            {strategicPartners.map((partner, i) => <a href={partner.href} className="alliance-card" key={partner.name} target="_blank" rel="noreferrer"><span className="alliance-index">0{i + 1}</span><div className="alliance-copy"><h3>{partner.name}</h3><p className="tier">{partner.tier}</p></div><p>{partner.body}</p><Icon name="arrow-up-right" /></a>)}
          </div>
        </section>

        <section className="thesis-preview section-pad">
          <SectionHeading eyebrow="04 / Investment focus" title="Where we invest" intro="We partner with founders building in sectors where our team has deep operational experience and strong networks to add real value." action={{ href: "/thesis", label: "Read our full thesis" }} />
          <div className="sector-layout">
            <div className="sector-list">{homeSectors.map((sector, i) => <article className={activeSector === i ? "active" : ""} key={sector.title} tabIndex="0" role="button" aria-pressed={activeSector === i} aria-controls="sector-focus-visual" onMouseEnter={() => selectSector(i)} onFocus={() => selectSector(i)} onClick={() => selectSector(i)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectSector(i); } }}><span>{sector.value}</span><div><h3>{sector.title}</h3><p>{sector.body}</p></div><span className="sector-arrow"><Icon name="arrow-right" /></span></article>)}</div>
              <SectorFocusVisual key={homeSectors[activeSector].title} sector={homeSectors[activeSector]} index={activeSector} />
          </div>
        </section>

        <section className="partner-rail section-pad-sm">
          <p className="eyebrow">Technology partners & grant providers</p>
          <div className="logo-grid">{technologyPartners.map((partner) => <TechnologyPartnerCell partner={partner} key={partner.name} />)}</div>
          <ArrowLink href="/partners">See more of our activated partnerships</ArrowLink>
        </section>

        <section className="home-consortium section-pad">
          <SectionHeading eyebrow="Consortium partners" title="Backed by leading Consortium Partners" intro="Venture funds, accelerators, and venture builders co-investing in and scaling European startups." action={{ href: "/partners", label: "Explore our partner ecosystem" }} />
          <div className="home-consortium-grid">
            {homepageConsortium.map((partner) => (
              <a href={partner.href} target="_blank" rel="noreferrer" key={partner.name}>
                <span>{partner.type}</span><h3>{partner.name}</h3><Icon name="arrow-up-right" />
              </a>
            ))}
          </div>
        </section>

        <section className="ecosystem-section section-pad">
          <SectionHeading eyebrow="05 / Cross-border platform" title="What we're building" intro="We're not just investing. We're building the infrastructure for Poland to become Europe's next startup hub." />
          <div className="ecosystem-layout">
            <div className="ecosystem-map">
              <WireframeDottedGlobe />
              <p>200+ Startups in network across AI, SaaS, deep tech & climate</p>
            </div>
            <div className="chapter-list">{ecosystemChapters.map((chapter) => <article key={chapter.title}><span>{chapter.number}</span><div><h3>{chapter.title}</h3><p>{chapter.body}</p></div></article>)}</div>
          </div>
        </section>

        <section className="portfolio-section section-pad">
          <SectionHeading eyebrow="06 / Portfolio" title="Projects Portfolio" intro="Active portfolio of high-potential startups undergoing rapid acceleration to transform innovative technology into scalable, market-ready commercial assets." action={{ href: "/partners#portfolio", label: "Discover More" }} />
          <div className="portfolio-grid">{homepagePortfolio.map((company, i) => <PortfolioCard company={company} index={i} wide={i === 0} key={company.name} />)}</div>
        </section>

        <section className="testimonials-section section-pad">
          <SectionHeading eyebrow="07 / Founder voices" title="What founders say" intro="Our portfolio is confidential. Their words speak for themselves." />
          <div className="testimonial-grid">{testimonials.map((item, i) => <article key={item.quote} className={i === 1 ? "featured" : ""}><span className="quote">“</span><blockquote>{item.quote}</blockquote><div><strong>{item.role}</strong><span>{item.company}</span></div></article>)}</div>
        </section>

        <section className="home-newsletter section-pad">
          <div><p className="eyebrow">Odra Venture</p><h2>Stay in the Loop</h2><p>Join 5,000+ founders and investors getting weekly insights on the European startup ecosystem.</p><small>No spam. Unsubscribe anytime.</small></div>
          <Newsletter />
        </section>

        <CallToAction title="Building something ambitious?" body="We're looking for exceptional founders tackling meaningful problems. If you're pre-seed to Series A in Europe, we want to hear from you." action="Start Your Application" href="/apply" />
      </main>
    </>
  );
}

function InternalHero({ eyebrow, title, intro, tone = "lavender", meta }) {
  return (
    <section className={`internal-hero ${tone}`}>
      <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p>{meta && <div className="hero-meta">{meta.map((item) => <span key={item}>{item}</span>)}</div>}</div>
      <div className="internal-hero-art"><span>01</span><Icon name="compass" /><i /></div>
    </section>
  );
}

function TeamPage() {
  return (
    <main className="internal-page">
      <InternalHero eyebrow="Our Team" title="Acceleration & Investment Committee" intro="Investors and world class technology experts guiding portfolio companies from validation to scale." tone="lavender" meta={["200+ Startups in Our Network", "60+ Partner Companies", "50+ World Class Experts", "$95M+ Partner Capital Committed"]} />
      <section className="team-directory section-pad"><SectionHeading eyebrow="Our Team" title="Committee Members" intro="Seasoned investors and world class technology experts across European and international markets" />
        <div className="team-grid">{team.map((person, i) => <article className={`team-card team-tone-${(i % 4) + 1}`} key={person.name}>
          <div className="team-card-shell">
            <a className="team-image" href={person.linkedin} target="_blank" rel="noreferrer" aria-label={`View ${person.name} on LinkedIn`}>
              <img src={person.image} alt={person.name} loading="lazy" decoding="async" />
              <span className="team-index">{String(i + 1).padStart(2, "0")}</span>
              <span className="team-link-icon"><Icon name="arrow-up-right" /></span>
              <span className="team-image-caption">View profile</span>
            </a>
            <div className="team-content">
              <div className="team-card-heading"><p className="eyebrow">{person.role}</p><span>Odra Venture</span></div>
              <h2>{person.name}</h2>
              <strong>{person.meta}</strong>
              <p>{person.body}</p>
              <div className="tag-list">{person.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            </div>
          </div>
        </article>)}</div>
      </section>
      <section className="background-strip"><p>Our Team's Background</p><div>{["Forbes Council", "Sony Pictures", "HBO", "MTG", "LSE", "AWS Partner", "AI & ML"].map((item) => <span key={item}>{item}</span>)}</div></section>
      <CallToAction title="Join Our Network" body="Looking for experienced operators and advisors to join our ecosystem." action="Become a Partner" href="/partners" />
    </main>
  );
}

function PartnersPage() {
  const [filter, setFilter] = useState("All");
  const types = ["All", ...new Set(consortiumPartners.map((item) => item.type))];
  const filtered = filter === "All" ? consortiumPartners : consortiumPartners.filter((item) => item.type === filter);
  return (
    <main className="internal-page">
      <InternalHero eyebrow="Partner Ecosystem" title="Built on partnerships, driven by impact" intro="Our portfolio startups gain direct access to $95M+ in partner capital, 890+ technology grants, and a network spanning 4 countries." tone="mint" meta={["12+ Consortium Partners", "890+ Technology Grants", "$95M+ Capital Committed", "4 Countries"]} />
      <section className="section-pad"><SectionHeading eyebrow="Technology Partners" title="Startups in our portfolio get access to grants from these companies" />
        <div className="logo-grid large">{technologyPartners.map((partner) => <TechnologyPartnerCell partner={partner} key={partner.name} />)}</div>
      </section>
      <section className="section-pad consortium-section"><SectionHeading eyebrow="Partner ecosystem" title="Consortium Partners" intro="Venture funds, accelerators, and family offices co-investing and scaling European startups." />
        <div className="filter-row" role="group" aria-label="Filter partner categories">{types.map((type) => <button className={filter === type ? "active" : ""} aria-pressed={filter === type} onClick={() => setFilter(type)} key={type}>{type}</button>)}</div>
        <div className="consortium-grid">{filtered.map((partner, i) => <a href={partner.href} className="consortium-card" key={partner.name} target={partner.href === "#" ? undefined : "_blank"} rel="noreferrer"><div className="consortium-head"><span>{partner.type}</span><Icon name="arrow-up-right" /></div><h3>{partner.name}</h3><p>{partner.body}</p><div className="consortium-meta"><strong>{partner.value}</strong><span>{partner.place} · {partner.focus}</span></div></a>)}</div>
      </section>
      <section className="section-pad" id="portfolio"><SectionHeading eyebrow="Portfolio Companies" title="Active startups across our consortium" intro="Undergoing acceleration and strategic development." />
        <div className="portfolio-grid compact">{portfolio.map((company, i) => <PortfolioCard company={company} index={i} key={company.name} />)}</div>
        <p className="portfolio-more">EULER · Zero Energy · Genera · Glasson · Gama Cars · Eldoradoo · Shieldwear · Instapay · 30+ more startups in our network</p>
        <ArrowLink href="/contact?subject=portfolio">Request Full Portfolio (NDA)</ArrowLink>
      </section>
      <PartnerTracks />
      <CallToAction title="Looking for funding instead?" body="Apply to our accelerator program and get access to our full partner network." action="Apply as Startup" href="/apply" />
    </main>
  );
}

function PartnerTracks() {
  const tracks = [
    ["Technology Partner", "Offer grants & tools", "Provide technology credits, tools, or infrastructure to our portfolio of 200+ startups.", ["Access to vetted startup pipeline", "Brand visibility across network", "Co-marketing opportunities"], "/partner-apply?type=technology"],
    ["Consortium Partner", "Co-invest & syndicate", "Join our consortium of VCs and family offices co-investing in European deep tech and AI ventures.", ["Curated deal flow", "Syndication opportunities", "Due diligence support"], "/partner-apply?type=consortium"],
    ["Corporate Partner", "Pilot & scale", "Access innovation through startup pilots, proof-of-concept projects, and strategic collaborations.", ["Innovation pipeline", "Pilot programs", "Strategic advisory"], "/partner-apply?type=corporate"],
  ];
  return <section className="section-pad track-section"><SectionHeading eyebrow="Become a Partner" title="Three ways to join our ecosystem" intro="Select the track that fits your organization." /><div className="track-grid">{tracks.map(([title, meta, body, bullets, href], i) => <article key={title}><span>0{i + 1}</span><h3>{title}</h3><strong>{meta}</strong><p>{body}</p><ul>{bullets.map((b) => <li key={b}>{b}</li>)}</ul><ButtonLink href={href} secondary>Apply Now</ButtonLink></article>)}</div></section>;
}

function ThesisPage() {
  const [active, setActive] = useState(0);
  return (
    <main className="internal-page">
      <InternalHero eyebrow="Investment Thesis" title="How we think about investing" intro="We back exceptional founders building transformative companies in sectors where our team can add genuine value beyond capital." tone="blue" />
      <section className="editorial-split section-pad"><div><p className="eyebrow">Our philosophy</p><h2>Deep conviction in exceptional founders.</h2></div><div className="long-copy"><p>We believe the best venture investments come from deep conviction in exceptional founders, not from spray-and-pray approaches. Our team has built and scaled companies across energy, e-commerce, and luxury markets, and we bring that operational experience to every partnership.</p><p>We're not just writing checks. We're rolling up our sleeves to help founders navigate the specific challenges of scaling in and from Europe: accessing international markets, navigating regulatory complexity, and building world-class teams.</p><p>Our acceleration and technology grant decisions are made case-by-case, allowing us to move quickly and commit deeply to the founders we back.</p></div></section>
      <section className="section-pad thesis-areas"><SectionHeading eyebrow="Focus areas" title="Sectors where our team can add real value" intro="We invest in sectors where our team has deep operational experience and strong networks to add real value." />
        <div className="thesis-area-layout"><div>{thesisAreas.map((area, i) => <button key={area.title} className={active === i ? "active" : ""} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)}><span>{area.number}</span><div><h3>{area.title}</h3><p>{area.body}</p></div><Icon name="arrow-right" /></button>)}</div><aside><span>{thesisAreas[active].number}</span><h3>{thesisAreas[active].title}</h3><div className="tag-list">{thesisAreas[active].tags.map((tag) => <span key={tag}>{tag}</span>)}</div></aside></div>
      </section>
      <section className="section-pad criteria-section"><SectionHeading eyebrow="What we look for" title="We invest in people" intro="We evaluate opportunities based on team, market, and product, but ultimately, we invest in people. Here's what makes a compelling opportunity for us." />
        <div className="criteria-grid">{investmentCriteria.map((item, i) => <article key={item}><span>0{i + 1}</span><h3>{item}</h3></article>)}</div>
      </section>
      <CallToAction title="Sound like a fit?" body="We're always excited to meet ambitious founders. It's never too early to start a conversation." action="Apply Now" href="/apply" />
    </main>
  );
}

function NewsroomPage() {
  const featured = news[0];
  return (
    <main className="internal-page">
      <InternalHero eyebrow="Portfolio newsroom" title="Funding updates from the startups we back" intro="A quieter record of the product work now moving forward across the Odra Venture portfolio, with matching links to each startup's own announcement." tone="peach" />
      <section className="section-pad featured-news"><p className="featured-news-support">Each note links to the startup's own newsroom announcement so portfolio and company narratives stay aligned.</p><article><div className="news-art"><img src="/assets/odra-editorial-yellow.webp" alt="Abstract pastel yellow editorial artwork" loading="lazy" decoding="async" /><span>$450,000</span><small>seed round</small></div><div><div className="news-meta"><span>Portfolio Funding</span><span>{featured.date}</span><span>{featured.read}</span></div><h2>{featured.title}</h2><p>{featured.body}</p><div className="tag-list"><span>{featured.company}</span><span>{featured.category}</span><span>{featured.focus}</span></div><ArrowLink href={featured.href}>Read featured update</ArrowLink></div></article></section>
      <section className="news-list-section section-pad"><SectionHeading eyebrow="Newsroom" title="Portfolio funding notes" intro="Startup-by-startup updates on what the current round supports across product, infrastructure, and go-to-market execution." />
        <div className="news-grid">{news.slice(1).map((item, i) => <article className="news-card" key={item.company}><img className="news-card-image" src={editorialImages[i % editorialImages.length]} alt="" aria-hidden="true" loading="lazy" decoding="async" /><div className="news-card-meta"><span>{item.category}</span><span>{item.read}</span></div><h3>{item.company}</h3><p>{item.body}</p><dl><dt>Backing</dt><dd>Red Queen Fund and Odra Venture</dd><dt>Focus</dt><dd>{item.focus}</dd></dl><ArrowLink href={item.href}>Read update</ArrowLink></article>)}</div>
      </section>
    </main>
  );
}

function EventsPage() {
  return (
    <main className="internal-page">
      <InternalHero eyebrow="Events" title="Events" intro="We're building a calendar of events that bring together the people shaping European technology." tone="yellow" />
      <section className="section-pad events-grid">{events.map((event, i) => <article key={event.title} className={i === 0 ? "featured" : ""}><span>{event.number}</span><div><h2>{event.title}</h2><p>{event.body}</p><div className="event-meta"><span>{event.meta}</span><span>{event.audience}</span></div></div><Icon name="arrow-up-right" /></article>)}</section>
      <section className="date-panel section-pad"><div><p className="eyebrow">Schedule</p><h2>Dates and details coming soon</h2><p>We'll announce event dates, locations, and registration through our newsletter.</p></div><div className="date-panel-signup"><Newsletter /><small>No spam. Unsubscribe anytime.</small></div></section>
      <CallToAction title="Interested in speaking or sponsoring?" body="We're open to partnerships with organisations that share our commitment to early-stage technology companies in Europe." action="Get in touch" href="mailto:events@odraventure.com" />
    </main>
  );
}

function FAQPage() {
  return (
    <main className="internal-page">
      <InternalHero eyebrow="Answers" title="Frequently Asked Questions" intro="Everything you need to know about working with Odra Venture." tone="lavender" />
      <section className="section-pad faq-layout"><aside><p>Browse by topic</p>{faqGroups.map((group, i) => <a href={`#faq-${i}`} key={group.title}><span>0{i + 1}</span>{group.title}</a>)}</aside><div>{faqGroups.map((group, groupIndex) => <section className="faq-group" id={`faq-${groupIndex}`} key={group.title}><p className="eyebrow">0{groupIndex + 1}</p><h2>{group.title}</h2>{group.items.map(([question, answer], i) => <FAQItem key={question} number={`${groupIndex + 1}.${i + 1}`} question={question} answer={answer} />)}</section>)}</div></section>
      <CallToAction title="Still have questions?" action="Get in touch" href="/contact" />
    </main>
  );
}

function FAQItem({ number, question, answer }) {
  const [open, setOpen] = useState(false);
  return <div className={`faq-item ${open ? "open" : ""}`}><button aria-expanded={open} onClick={() => setOpen(!open)}><span>{number}</span><strong>{question}</strong><i /></button><div className="faq-answer"><p>{answer}</p></div></div>;
}

function ApplyPage() {
  const [cofounders, setCofounders] = useState([]);
  const [message, setMessage] = useState("");
  function submit(e) { e.preventDefault(); setMessage("Your founder profile is ready to continue."); }
  return (
    <main className="internal-page apply-page">
      <InternalHero eyebrow="Application" title="Start Your Application" intro="We're looking for exceptional founders building in technology, energy, e-commerce, and premium markets." tone="peach" meta={["€25K–€250K typical investment", "Review within max. 2 weeks", "Feedback on all applications", "Introduction call if there's a fit", "Transparent process throughout"]} />
      <section className="application-shell section-pad"><div className="application-steps">{["Founder", "Company", "Pitch", "Ask"].map((item, i) => <div className={i === 0 ? "active" : ""} key={item}><span>{i + 1}</span><strong>{item}</strong></div>)}</div>
        <form className="application-form" onSubmit={submit}><div className="form-heading"><p className="eyebrow">Step 01</p><h2>Founder Profile</h2><p>Tell us about you.</p></div><div className="field-grid"><label>First Name*<input required placeholder="Jane" /></label><label>Last Name*<input required placeholder="Smith" /></label><label>Email*<input required type="email" placeholder="jane@company.com" /></label><label>LinkedIn Profile*<input required type="url" placeholder="https://linkedin.com/in/yourprofile" /></label><label>Role / Title at Company*<input required placeholder="CEO & Co-Founder" /></label><label>Phone<input type="tel" placeholder="+1 555 000 0000" /></label></div><div className="cofounders"><div><h3>Co-Founders</h3><button type="button" onClick={() => setCofounders([...cofounders, cofounders.length + 1])}>Add Co-Founder</button></div>{cofounders.length === 0 ? <p>No co-founders added yet.</p> : cofounders.map((n) => <div className="cofounder-row" key={n}><label>Co-Founder Name<input required placeholder="Full name" /></label><label>Co-Founder Email<input required type="email" placeholder="email@company.com" /></label></div>)}</div><div className="form-submit"><p>By submitting, you agree to our Privacy Policy and Terms of Service.</p><button className="button button-primary" type="submit">Continue <Icon name="arrow-right" /></button></div>{message && <p className="success-message" role="status">{message}</p>}</form>
      </section>
    </main>
  );
}

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <main className="internal-page"><InternalHero eyebrow="Contact" title="Get in touch" intro="Whether you're a founder, investor, or potential partner, we'd love to hear from you." tone="mint" />
      <section className="contact-layout section-pad"><form onSubmit={(e) => { e.preventDefault(); setSent(true); e.currentTarget.reset(); }}><h2>Send a message</h2><label>Name<input required placeholder="Your name" /></label><label>Email<input required type="email" placeholder="you@company.com" /></label><label>Subject<input required placeholder="What's this about?" /></label><label>Message<textarea required placeholder="Tell us more..." rows="6" /></label><button className="button button-primary" type="submit">Send Message <Icon name="arrow-right" /></button>{sent && <p className="success-message">Your message is ready for the Odra team.</p>}</form><aside><div><p className="eyebrow">Contact</p><a href="mailto:hello@odraventure.com">Email<strong>hello@odraventure.com</strong></a><a href="tel:+48571211808">Phone<strong>+48 571 211 808</strong></a><span>Office<strong>Warszawa & Wrocław, Poland</strong></span><span>Response time<strong>Within 48 hours</strong></span></div><div><h3>Book a meeting</h3><ArrowLink href="https://calendly.com">Schedule a Call</ArrowLink></div><div><h3>Follow</h3><div className="contact-socials"><a href="https://linkedin.com/company/odra-venture" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://twitter.com/OdraVenture" target="_blank" rel="noreferrer">Twitter</a></div></div><div><h3>Legal entity</h3><p>ODRA VENTURE SP. Z O.O.</p><p>KRS: 0001225642 · NIP: 1133194972 · REGON: 544050560</p></div></aside></section>
    </main>
  );
}

function ProcessPage() {
  const facts = [["€25K to €250K", "Check Size"], ["3% to 8%", "Equity"], ["SAFE / Convertible Note", "Instrument"], ["Pre-seed & Seed", "Stage"], ["3 to 6 weeks", "Timeline"], ["Every application", "Response"]];
  return <main className="internal-page"><InternalHero eyebrow="Application process" title="How it works" intro="From application to onboarding in 3 to 6 weeks. We believe in transparency. Here's exactly what to expect." tone="blue" /><section className="section-pad"><div className="fact-grid">{facts.map(([value, label]) => <article key={label}><strong>{value}</strong><span>{label}</span></article>)}</div><div className="process-grid">{processSteps.map((step) => <article key={step.number}><span>{step.number}</span><div><p>{step.meta}</p><h2>{step.title}</h2><p>{step.body}</p></div></article>)}</div><div className="center-action"><ButtonLink href="/apply">Start Your Application</ButtonLink><small>Average time to complete: 5 minutes</small></div></section></main>;
}

function ResourcesPage() {
  return <main className="internal-page"><InternalHero eyebrow="Resources" title="Founder Resources & EU Funding" intro="Guides, templates, and comprehensive information on European funding opportunities." tone="yellow" /><section className="section-pad"><SectionHeading eyebrow="EU Funding Programmes" title="Key programmes for European startups" /><div className="funding-grid">{euFunding.map((item) => <a href={item.href} key={item.title} target="_blank" rel="noreferrer"><div><span>{item.type}</span><Icon name="external-link" /></div><h3>{item.title}</h3><strong>{item.value}</strong><p>{item.body}</p></a>)}</div></section><section className="section-pad resource-news"><SectionHeading eyebrow="Latest News" title="European startup ecosystem updates" /><div>{resourceNews.map(([date, source, title, body]) => <article key={title}><span>{date} · {source}</span><h3>{title}</h3><p>{body}</p></article>)}</div></section><section className="section-pad"><SectionHeading eyebrow="Founder Toolkit" title="Essential resources for building" /><div className="toolkit-grid">{[["Guide", "Startup Funding Guide 2026", "Complete guide to raising capital in Europe"], ["Templates", "EU Grant Application Templates", "Ready-to-use templates for major EU programmes"], ["Toolkit", "Legal Toolkit for Founders", "Essential legal documents and frameworks"]].map(([type, title, body]) => <article key={title}><span>{type}</span><h3>{title}</h3><p>{body}</p><small>More resources coming soon. Join our portfolio to get early access.</small></article>)}</div></section><CallToAction title="Need help with funding?" body="Our team has extensive experience navigating EU funding programmes. Apply to join our portfolio for hands-on support." action="Apply to Odra Venture" href="/apply" /></main>;
}

function PressPage() {
  const boilerplates = [
    ["short (21 words)", "Odra Venture is a European startup accelerator based in Wrocław, Poland, backing 200+ early-stage founders in AI, SaaS, and deep tech."],
    ["medium (52 words)", "Odra Venture is a European startup accelerator and venture platform based in Wrocław, Poland. We connect exceptional founders with experienced investors, strategic partners, and $1M+ in cloud credits and tools. With 200+ startups in our network and 890+ technology grants including AWS, Microsoft, and Cloudflare, we're building Poland's most connected startup ecosystem."],
    ["long (108 words)", "Odra Venture Sp. z o.o. is a European startup accelerator and venture platform headquartered in Wrocław, Poland. Founded to back Europe's most ambitious founders, Odra Venture provides early-stage capital (€25K to €250K), structured mentorship, and access to a curated partner network spanning cloud infrastructure, enterprise customers, and co-investors. With 200+ startups currently in our network, partnerships with AWS, Microsoft, Cloudflare, and 20+ Consortium Partners, and a team with 50+ years of combined experience from Sony, HBO, MTG, and Forbes Council, Odra Venture is building the infrastructure for Poland to become Europe's leading startup hub. Our focus sectors include AI/ML, B2B SaaS, Energy & Clean Tech, and Premium Markets."],
  ];
  return <main className="internal-page"><InternalHero eyebrow="Media" title="Press Kit" intro="Everything journalists, partners, and event organizers need to feature Odra Venture." tone="lavender" /><section className="section-pad press-logos"><SectionHeading eyebrow="Logos" title="Approved brand assets" /><div><article><img src="/assets/odra-ventures-logo.png" alt="Odra Venture Logo" /><p>Full logo (light background)</p><a href="/assets/odra-ventures-logo.png" download>PNG <Icon name="arrow-right" /></a></article><article className="dark-logo"><img src="/assets/odra-ventures-logo.png" alt="Odra Venture Logo White" /><p>Full logo</p><a href="/assets/odra-ventures-logo.png" download>PNG <Icon name="arrow-right" /></a></article></div><p>Please don't modify, rotate, or recolor our logos. Maintain clear space around the logo.</p></section><section className="section-pad boilerplates"><SectionHeading eyebrow="Company Boilerplate" title="Copy-ready company descriptions" /><div>{boilerplates.map(([length, text]) => <CopyBlock key={length} length={length} text={text} />)}</div></section><section className="section-pad"><SectionHeading eyebrow="Key Facts" title="At a glance" /><div className="fact-grid">{["Founded: 2025", "HQ: Wrocław, Poland", "Startups: 200+ in network", "Partners: 890+", "Focus: AI, SaaS, Deep Tech, Climate", "Check Size: €25K to €250K", "Founder: Shubham Kishore", "Legal: KRS 0001225642"].map((fact) => <article key={fact}><strong>{fact}</strong></article>)}</div></section><CallToAction title="Media Contact" body="For press inquiries: hello@odraventure.com. We typically respond to media inquiries within 24 hours." action="Email the team" href="mailto:hello@odraventure.com" /></main>;
}

function CopyBlock({ length, text }) {
  const [copied, setCopied] = useState(false);
  return <article><div><span>{length}</span><button onClick={() => { navigator.clipboard?.writeText(text); setCopied(true); }}>{copied ? "Copied" : "Copy"}</button></div><p>{text}</p></article>;
}

function LegalPage() {
  return <main className="internal-page legal-page"><InternalHero eyebrow="Legal" title="Legal information" intro="Privacy Policy, Terms of Service, Investment Disclaimer, and Cookie Policy." tone="blue" />
    <section className="editorial-split section-pad" id="company-details"><div><p className="eyebrow">Company details</p><h2>Odra Venture Sp. z o.o.</h2></div><div className="long-copy legal-details"><dl><dt>Registered Name</dt><dd>ODRA VENTURE SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ</dd><dt>Short Name</dt><dd>Odra Venture Sp. z o.o.</dd><dt>KRS</dt><dd>0001225642</dd><dt>NIP</dt><dd>1133194972</dd><dt>REGON</dt><dd>544050560</dd><dt>Registered Office</dt><dd>Wrocław, Poland</dd></dl></div></section>
    <section className="editorial-split section-pad legal-section" id="privacy"><div><p className="eyebrow">Privacy</p><h2>Privacy Policy</h2></div><div className="long-copy"><p>Odra Venture Sp. z o.o. is committed to protecting your privacy in accordance with the General Data Protection Regulation (GDPR) and Polish data protection law. This policy explains how we collect, use, and protect your personal information.</p><p>We collect information you provide directly to us, such as when you apply to our accelerator programme, contact us, or subscribe to our communications.</p><p>We use this information to evaluate applications, communicate with you, and improve our services. We do not sell your personal information to third parties.</p><p>You have the right to access, rectify, or delete your personal data at any time. To exercise these rights, contact us at <a href="mailto:legal@odraventure.com">legal@odraventure.com</a>.</p></div></section>
    <section className="editorial-split section-pad legal-section" id="terms"><div><p className="eyebrow">Website use</p><h2>Terms of Service</h2></div><div className="long-copy"><p>By using our website and services, you agree to these terms. Odra Venture Sp. z o.o. provides this website and its contents on an “as is” basis.</p><p>We reserve the right to modify or discontinue any aspect of our services at any time without notice.</p></div></section>
    <section className="editorial-split section-pad legal-section" id="disclaimer"><div><p className="eyebrow">Investment</p><h2>Investment Disclaimer</h2></div><div className="long-copy"><p><strong>Odra Venture Sp. z o.o. does not operate as a registered investment fund.</strong></p><p>Acceleration and investment decisions are made on a case-by-case basis by individual partners and participating investors. Nothing on this website constitutes investment advice or an offer to invest.</p><p>Past performance of portfolio companies does not guarantee future results. Startup investments are inherently risky and may result in partial or total loss of capital.</p></div></section>
    <section className="editorial-split section-pad legal-section" id="cookies"><div><p className="eyebrow">Cookies</p><h2>Cookie Policy</h2></div><div className="long-copy"><p>This website uses cookies to enhance your browsing experience. By continuing to use our site, you consent to our use of cookies in accordance with this policy.</p><p>We use essential cookies for site functionality and optional analytics cookies to understand how visitors interact with our site. You can manage your preferences through your browser settings.</p></div></section>
    <section className="editorial-split section-pad legal-section" id="legal-contact"><div><p className="eyebrow">Contact</p><h2>Legal & data protection</h2></div><div className="long-copy legal-contact-list"><a href="mailto:legal@odraventure.com">legal@odraventure.com</a><a href="mailto:hello@odraventure.com">hello@odraventure.com</a><a href="tel:+48571211808">+48 571 211 808</a><p>Last updated: February 2026.</p></div></section>
  </main>;
}

function CallToAction({ title, body, action, href }) {
  return (
    <section className="final-cta">
      <div className="final-cta-copy"><h2>{title}</h2>{body && <p>{body}</p>}</div>
      <div className="final-cta-action">
        <div className="founder-path-visual" aria-hidden="true">
          <img src="/assets/odra-architectural-hero.webp" alt="" loading="lazy" decoding="async" />
          <span className="founder-path-destination"><Icon name="arrow-up-right" /></span>
        </div>
        {action && <ButtonLink href={href}>{action}</ButtonLink>}
      </div>
    </section>
  );
}

const routeMap = {
  "/": HomePage,
  "/team": TeamPage,
  "/partners": PartnersPage,
  "/thesis": ThesisPage,
  "/newsroom": NewsroomPage,
  "/events": EventsPage,
  "/faq": FAQPage,
  "/apply": ApplyPage,
  "/contact": ContactPage,
  "/process": ProcessPage,
  "/resources": ResourcesPage,
  "/press": PressPage,
  "/legal": LegalPage,
};

function InternalMotionController({ pathname }) {
  useInternalMotion(pathname);
  return null;
}

export function App() {
  const pathname = window.location.pathname.replace(/\/$/, "") || "/";
  const Page = useMemo(() => {
    if (pathname.startsWith("/newsroom/")) return NewsroomPage;
    return routeMap[pathname] || HomePage;
  }, [pathname]);
  useEffect(() => {
    document.documentElement.classList.toggle("home-route", pathname === "/");
  }, [pathname]);
  return <><Header />{pathname !== "/" && <><InternalMotionController pathname={pathname} /><div className="page-scroll-progress" aria-hidden="true"><span /></div></>}<Page /><Footer /><CookieNotice /></>;
}
