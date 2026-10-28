import { Defs } from "@/components/Defs";
import { Cursor, Nav, Rail } from "@/components/Chrome";
import ScrollEngine from "@/components/ScrollEngine";
import Intro from "@/components/Intro";
import Band from "@/components/Band";
import Services from "@/components/Services";
import Work from "@/components/Work";
import Clients from "@/components/Clients";
import Book from "@/components/Book";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Defs />
      <Rail />
      <Cursor />
      <Nav />
      <main>
        <Intro />
        <Band variant="navy" dir={-1} />
        <Services />
        <Band variant="orange" rev dir={1} style={{ marginTop: -30, marginBottom: -30 }} />
        <Work />
        <Clients />
        <Band variant="navy" rev dir={-1} style={{ marginTop: -30, marginBottom: -30 }} />
        <Book />
        <Contact />
      </main>
      <ScrollEngine />
    </>
  );
}
