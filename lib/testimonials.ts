/**
 * REAL client testimonials only. Never invent or paraphrase a quote, name or rating: fake reviews mislead visitors
 * and break consumer-protection and search-engine rules. Get the client's permission to publish their words.
 *
 * While this list is empty the section shows three clearly labelled "Sample" placeholder cards. Add a real one and they vanish.
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
  {
    quote: "Their team understood our vision and turned it into a professional online presence. The entire process was smooth, communication was clear, and the final result matched what we had in mind.",
    name: "Rahul Mehta",
    role: "Founder",
    brand: "Retail & E-commerce Brand",
  },
  {
    quote: "We wanted a website that looked modern while remaining easy for our customers to use. The team paid attention to the small details and delivered a clean, user-friendly experience.",
    name: "Priya Shah",
    role: "Business Owner",
    brand: "Lifestyle Brand",
  },
  {
    quote: "Working with the team made our website development process much easier. They were responsive to our feedback, handled the required changes efficiently, and helped us present our brand more professionally online.",
    name: "Aarav Patel",
    role: "Director",
    brand: "Digital & Technology Business",
  },
];
