export const site = {
  name: "By Areeqaan",
  shortName: "BA",
  tagline: "Trendy · Minimal · Affordable Luxe",
  description:
    "By Areeqaan crafts minimal, trendy jewellery — bracelets, necklaces, rings and more — delivered across Pakistan and worldwide.",
  whatsapp: {
    display: "+92 336 4246604",
    // wa.me requires the number in international format with no symbols
    number: "923364246604",
  },
  socials: {
    instagram: { handle: "@byareeqaan", url: "https://instagram.com/byareeqaan" },
    tiktok: { handle: "@by_areeqan", url: "https://www.tiktok.com/@by_areeqan" },
    facebook: { handle: "ByAreeqan", url: "https://facebook.com/ByAreeqan" },
  },
} as const;

export type Collection = {
  name: string;
  blurb: string;
  /** hue pair used for the artwork gradient */
  from: string;
  to: string;
};

export const collections: Collection[] = [
  {
    name: "Necklaces",
    blurb: "Delicate chains & statement pendants that frame every neckline.",
    from: "#6d28d9",
    to: "#a78bfa",
  },
  {
    name: "Bracelets",
    blurb: "Stackable, dainty and bold — wristwear for every mood.",
    from: "#4c1d95",
    to: "#8b5cf6",
  },
  {
    name: "Rings",
    blurb: "Sculptural bands & minimal solitaires made to be layered.",
    from: "#7c3aed",
    to: "#c4b5fd",
  },
  {
    name: "Earrings",
    blurb: "From whisper-quiet studs to drops that catch the light.",
    from: "#5b21b6",
    to: "#a855f7",
  },
  {
    name: "Anklets",
    blurb: "Subtle shimmer for sunlit days and barefoot evenings.",
    from: "#6d28d9",
    to: "#d8b4fe",
  },
  {
    name: "Handcuffs",
    blurb: "Hand chains & bracelet-ring sets for an editorial edge.",
    from: "#4338ca",
    to: "#8b5cf6",
  },
  {
    name: "Nails",
    blurb: "Press-on artistry — trend-led sets in every finish.",
    from: "#7e22ce",
    to: "#e9d5ff",
  },
  {
    name: "Earcuffs",
    blurb: "No-pierce sculptural cuffs to complete the stack.",
    from: "#5b21b6",
    to: "#c084fc",
  },
];

export const promises = [
  {
    title: "Handpicked & trend-led",
    body: "Every piece is chosen for its minimal, modern character — never mass, always meaningful.",
  },
  {
    title: "Delivered everywhere",
    body: "Fast, tracked delivery all over Pakistan and shipping abroad, wrapped to gift.",
  },
  {
    title: "Made to layer",
    body: "Designed as a system — mix metals, stack and restyle to make it yours.",
  },
  {
    title: "Ordering made easy",
    body: "Browse, message us on WhatsApp, and we'll handle the rest. Personal, simple, quick.",
  },
];

export const guarantee = {
  title: "100% money-back guarantee",
  intro:
    "We pack every order with love & care — but in the rare case your piece arrives damaged, you're fully covered with a 100% refund.",
  // Conditions a customer must meet to claim the damaged-item refund.
  conditions: [
    "Record a clear unboxing video while opening your parcel",
    "Keep the video continuous and unedited",
    "Show the package condition before opening it",
    "Contact us immediately after receiving the parcel",
  ],
  outro:
    "Our goal is to make your shopping experience safe, easy and worry-free.",
} as const;

