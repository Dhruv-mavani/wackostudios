import { TESTIMONIALS, type Testimonial } from "@/lib/testimonials";
import Split from "./Split";

// Placeholder cards, clearly tagged "Sample", shown until real testimonials are added to lib/testimonials.ts.
// They contain no invented names, quotes or ratings, and they disappear as soon as one real testimonial exists.
const SAMPLE: (Testimonial & { sample: true })[] = [1, 2, 3].map((n) => ({
  sample: true,
  quote: "A real client's words go here: two or three honest sentences about what changed for their brand.",
  name: `Client name ${n}`,
  role: "Role",
  brand: "Their brand",
  rating: 5,
}));

const initials = (name: string) => name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");

function Stars({ rating }: { rating: number }) {
  return (
    <span className="stars" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 24 24" aria-hidden="true" className={i <= rating ? "on" : ""}>
          <path d="M12 2l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 18l-6.4 3.6L7 14.5 1.7 9.5l7.2-.9L12 2z" />
        </svg>
      ))}
    </span>
  );
}

export default function Testimonials() {
  const items: (Testimonial & { sample?: boolean })[] = TESTIMONIALS.length > 0 ? TESTIMONIALS : SAMPLE;

  return (
    <section className="proof" id="testimonials" aria-label="What clients say">
      <div className="in">
        <p className="eyebrow">What clients say</p>
        <Split parts={["Kind words, ", { em: "earned." }]} />
        <div className="proof-grid">
          {items.map((t, i) => (
            <figure className="proof-card rv" key={`${t.name}-${i}`} style={{ "--d": `${i * 0.08}s` } as React.CSSProperties}>
              {t.sample && <span className="proof-tag">Sample</span>}
              <Stars rating={t.rating ?? 5} />
              <blockquote>{t.quote}</blockquote>
              <figcaption>
                <span className="proof-av" aria-hidden="true">{initials(t.name)}</span>
                <span>
                  <b>{t.name}</b>
                  <small>{[t.role, t.brand].filter(Boolean).join(", ")}</small>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
