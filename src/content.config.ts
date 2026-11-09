import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const makes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/makes" }),
  schema: z.object({
    name: z.string(),
    blurb: z.string(),
    popular: z.boolean().default(false),
  }),
});

const partsCategories = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/parts-categories" }),
  schema: z.object({
    name: z.string(),
    blurb: z.string(),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: z.object({
    name: z.string(),
    summary: z.string(),
    ctaLabel: z.string().default("Enquire Now"),
  }),
});

export const collections = { makes, partsCategories, services };
