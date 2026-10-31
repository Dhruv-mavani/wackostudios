"use client";

import { useState } from "react";
import { EMAIL, INSTAGRAM_URL, PHONE } from "@/lib/data";
import { copyText } from "@/lib/copy";
import { goTo } from "@/lib/scroll";
import Split from "./Split";

function CopyButton({ text }: { text: string }) {
  const [label, setLabel] = useState("Copy");
  return <button className="btn sm" type="button" onClick={async () => { setLabel(await copyText(text)); setTimeout(() => setLabel("Copy"), 1600); }}>{label}</button>;
}

export default function Contact() {
  return (
    <section className="contact" id="contact" aria-label="Contact">
      {/* Background: the full logo, enlarged and faint, drifts from left to right across the lower contact area and footer (ScrollEngine drives data-mq tracks). */}
      <div className="logo-run" aria-hidden="true">
        <div className="mq-track" data-mq data-steady data-dir="1" data-speed="0.55">
          {[0, 1, 2, 3].map((k) => (
            <span key={k} className="lr-set"><i className="lr-logo" /><svg className="lr-star"><use href="#wedge" /></svg><i className="lr-logo" /><svg className="lr-star"><use href="#wedge" /></svg></span>
          ))}
        </div>
      </div>

      <div className="bigwedge" id="bigWedge" aria-hidden="true"><svg viewBox="0 0 128 120"><use href="#wedge" /></svg></div>
      <div className="in">
        <p className="eyebrow">Get in touch</p>
        <Split className="big" parts={["Let's work ", { em: "together." }]} />
        <p className="lead rv">Have a brand to build or a campaign to launch? Message us anywhere below and we will reply fast.</p>

        <div className="ct">
          <div className="ct-row rv">
            <span className="ct-tile ct-email" aria-hidden="true"><svg className="ct-glyph" viewBox="0 0 24 24"><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" /><path className="orange" d="M22 6l-10 7L2 6" /></svg></span>
            <div className="ct-main"><small>Email</small><div className="val">{EMAIL}</div></div>
            <div className="ct-act">
              <a className="btn sm" href={`mailto:${EMAIL}`}>Write to us</a>
              <CopyButton text={EMAIL} />
            </div>
          </div>
          <div className="ct-row rv">
            <span className="ct-tile ct-whatsapp" aria-hidden="true"><svg className="ct-glyph" viewBox="0 0 24 24"><path d="M3.2 20.8l1.5-4.6A9 9 0 1 1 8.2 19.6l-5 1.2z" /><path style={{ strokeWidth: 3.8 }} transform="translate(12.5 11.7) scale(.5) translate(-12 -12)" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg></span>
            <div className="ct-main"><small>Call or WhatsApp</small><div className="val">{PHONE}</div></div>
            <div className="ct-act">
              <a className="btn sm" href="https://wa.me/918733064171" target="_blank" rel="noopener">WhatsApp</a>
              <a className="btn sm" href="tel:+918733064171">Call</a>
              <CopyButton text={PHONE} />
            </div>
          </div>
          <div className="ct-row rv">
            <span className="ct-tile ct-instagram" aria-hidden="true"><svg className="ct-glyph" viewBox="0 0 24 24"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" /><circle className="orange" cx="12" cy="12" r="4.2" /><path d="M17.6 6.4h.01" strokeWidth="2.6" /></svg></span>
            <div className="ct-main"><small>Instagram</small><div className="val">@wackostudios.in</div></div>
            <div className="ct-act"><a className="btn sm" href={INSTAGRAM_URL} target="_blank" rel="noopener">Follow us</a></div>
          </div>
        </div>

        <footer>
          <span>© 2026 Wacko Studios. Creative marketing agency, India.</span>
          <button type="button" onClick={() => goTo("#intro")}>Back to top ↑</button>
        </footer>
      </div>
    </section>
  );
}
