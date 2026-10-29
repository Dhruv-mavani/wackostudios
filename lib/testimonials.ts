/**
 * REAL client testimonials only. Never invent or paraphrase a quote, name or rating: fake reviews mislead visitors
 * and break consumer-protection and search-engine rules. Get the client's permission to publish their words.
 *
 * While this list is empty the section is hidden on the live site (a labelled sample preview shows locally).
 * To add one, copy the shape below. `rating` is out of 5 and should be what the client actually gave (default 5).
 */
export type Testimonial = {
  quote: string;
  name: string;
  /** e.g. "Founder" */
  role?: string;
  /** brand or company the person speaks for */
  brand: string;
  rating?: number;
};

export const TESTIMONIALS: Testimonial[] = [
  // {
  //   quote: "Exactly what the client wrote or said, with their permission.",
  //   name: "Full name",
  //   role: "Founder",
  //   brand: "Their brand",
  //   rating: 5,
  // },
];
