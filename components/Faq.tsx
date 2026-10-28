import { FAQ } from "@/lib/seo";
import Split from "./Split";

export default function Faq() {
  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <div className="in">
        <p className="eyebrow">Good to know</p>
        <Split parts={["Questions, answered."]} />
        <p className="sr-only" id="faq-title">Frequently asked questions about Wacko Studios</p>
        <div className="faq-list">
          {FAQ.map((f) => (
            <details key={f.q} className="rv">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
