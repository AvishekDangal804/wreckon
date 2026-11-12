/**
 * Placeholder business details pending real information from the client.
 * Every value here is a stand-in, not a real detail — see docs/DISCOVERY.md §8.
 * Replace before launch.
 */

// Flips to true once the business confirms its real contact/licensing details.
// Gates whether contact info renders as functional links / gets published as
// LocalBusiness structured data — see BaseLayout.astro, Header.astro,
// Footer.astro, StickyCallButton.astro, contact.astro.
export const BUSINESS_INFO_CONFIRMED = false;

export const siteConfig = {
  name: "WRECKON",
  tagline: "Trusted Auto Wreckers & Used Parts",
  domain: "wreckon.com.au",
  url: "https://wreckon.com.au",

  phone: {
    display: "(03) 1234 5678",
    href: "tel:+61312345678",
  },
  email: "info@wreckon.com.au",

  address: {
    street: "Street address",
    suburb: "Melbourne",
    state: "VIC",
    postcode: "Postcode",
  },

  hours: [
    { days: "Mon–Fri", time: "Hours" },
    { days: "Sat", time: "Hours" },
    { days: "Sun", time: "Closed" },
  ],

  social: {
    facebook: "",
    instagram: "",
  },

  // ABN intentionally omitted — do not fabricate a business number.
} as const;
