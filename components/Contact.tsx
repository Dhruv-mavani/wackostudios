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
      <div className="bigwedge" id="bigWedge" aria-hidden="true"><svg viewBox="0 0 128 120"><use href="#wedge" /></svg></div>
      <div className="in">
        <p className="eyebrow">Get in touch</p>
        <Split className="big" parts={["Let's work ", { em: "together." }]} />
        <p className="lead rv">Have a brand to build or a campaign to launch? Message us anywhere below and we will reply fast.</p>

        <div className="ct">
          <div className="ct-row rv">
            <svg className="ct-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" /><path className="orange" d="M22 6l-10 7L2 6" /></svg>
            <div className="ct-main"><small>Email</small><div className="val">{EMAIL}</div></div>
            <div className="ct-act">
              <a className="btn sm" href={`mailto:${EMAIL}`}>Write to us</a>
              <CopyButton text={EMAIL} />
            </div>
          </div>
          <div className="ct-row rv">
            <svg className="ct-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z" /><path className="orange" d="M15.6 14.7v1a1 1 0 0 1-1.1 1 7.9 7.9 0 0 1-3.4-1.2 7.8 7.8 0 0 1-2.4-2.4 7.9 7.9 0 0 1-1.2-3.5 1 1 0 0 1 1-1.1h1a1 1 0 0 1 1 .8c.1.5.2.9.4 1.3a1 1 0 0 1-.2 1l-.4.4a6.3 6.3 0 0 0 2.4 2.4l.4-.4a1 1 0 0 1 1-.2c.4.2.9.3 1.3.4a1 1 0 0 1 .8 1z" /></svg>
            <div className="ct-main"><small>Call or WhatsApp</small><div className="val">{PHONE}</div></div>
            <div className="ct-act">
              <a className="btn sm" href="https://wa.me/918733064171" target="_blank" rel="noopener">WhatsApp</a>
              <a className="btn sm" href="tel:+918733064171">Call</a>
              <CopyButton text={PHONE} />
            </div>
          </div>
          <div className="ct-row rv">
            <svg className="ct-ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" /><circle className="orange" cx="12" cy="12" r="4.2" /><path d="M17.6 6.4h.01" strokeWidth="2.6" /></svg>
            <div className="ct-main"><small>Instagram</small><div className="val">@wackostudios.in</div></div>
            <div className="ct-act"><a className="btn sm" href={INSTAGRAM_URL} target="_blank" rel="noopener">Follow us</a></div>
          </div>
        </div>

        <footer>
          <div className="mark" role="img" aria-label="Wacko Studios" />
          <span>© 2026 Wacko Studios. Creative marketing agency, India.</span>
          <button type="button" onClick={() => goTo("#intro")}>Back to top ↑</button>
        </footer>
      </div>
    </section>
  );
}
