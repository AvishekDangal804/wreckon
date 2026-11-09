/**
 * Placeholder business details pending real information from the client.
 * Every value here is a stand-in, not a real detail — see docs/DISCOVERY.md §8.
 * Replace before launch.
 */
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
    street: "[Address pending]",
    suburb: "Melbourne",
    state: "VIC",
    postcode: "[Postcode pending]",
  },

  hours: [
    { days: "Mon–Fri", time: "[Hours pending]" },
    { days: "Sat", time: "[Hours pending]" },
    { days: "Sun", time: "Closed" },
  ],

  social: {
    facebook: "",
    instagram: "",
  },

  // ABN intentionally omitted — do not fabricate a business number.
} as const;
