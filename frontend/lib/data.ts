export type Product = {
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAt?: number;
  rating: number;
  reviewsCount: number;
  materials: string;
  origin: string;
  images: string[];
  badge?: "Nouveau" | "Best-seller" | "Édition limitée";
  description: string;
  stock: number;
};

const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`;

// Les visuels sont des photographies libres de droit (Pexels), choisies pour
// correspondre à la matière et à l'esprit de chaque pièce décrite. Elles
// servent de données de test réalistes pour la navigation du frontend.
export const products: Product[] = [
  {
    slug: "panier-raphia-tresse",
    name: "Panier en raphia tressé",
    category: "Maison",
    price: 68000,
    compareAt: 82000,
    rating: 4.8,
    reviewsCount: 34,
    materials: "Raphia naturel, cuir végétal",
    origin: "Tissé à Ambalavao",
    badge: "Best-seller",
    description:
      "Tressé à la main par des artisanes d'Ambalavao selon une technique transmise sur trois générations. Chaque panier met environ six heures à prendre forme sur le métier traditionnel.",
    stock: 14,
    images: [px(33476890), px(3554242), px(31047257)],
  },
  {
    slug: "plaid-lamba-coton",
    name: "Plaid Lamba en coton brossé",
    category: "Textile",
    price: 94000,
    rating: 4.9,
    reviewsCount: 51,
    materials: "Coton brossé 100%, teinture végétale",
    origin: "Tissé à Antsirabe",
    badge: "Nouveau",
    description:
      "Réinterprétation contemporaine du lamba traditionnel malgache, tissé sur métier à pédale. Les teintures sont extraites d'écorces et de racines locales.",
    stock: 22,
    images: [px(6634454), px(6851135), px(5908326)],
  },
  {
    slug: "bol-bois-palissandre",
    name: "Bol en bois de palissandre",
    category: "Maison",
    price: 45000,
    rating: 4.7,
    reviewsCount: 19,
    materials: "Palissandre issu de replantation certifiée",
    origin: "Sculpté à Ambositra",
    description:
      "Tourné à la main dans un atelier d'Ambositra, ville réputée pour son artisanat du bois. Chaque pièce révèle un veinage unique.",
    stock: 31,
    images: [px(4929712), px(10011988), px(4929712)],
  },
  {
    slug: "sac-cabas-cuir-raphia",
    name: "Cabas cuir & raphia",
    category: "Accessoires",
    price: 132000,
    compareAt: 149000,
    rating: 4.6,
    reviewsCount: 27,
    materials: "Cuir pleine fleur, raphia tressé",
    origin: "Assemblé à Antananarivo",
    badge: "Édition limitée",
    description:
      "Structure en cuir pleine fleur tannée localement, corps tressé main. Une pièce robuste conçue pour vieillir avec élégance.",
    stock: 8,
    images: [px(2433862), px(3554242), px(33476890)],
  },
  {
    slug: "coussin-brode-zebu",
    name: "Coussin brodé motif zébu",
    category: "Textile",
    price: 52000,
    rating: 4.5,
    reviewsCount: 12,
    materials: "Lin, broderie fil de soie",
    origin: "Brodé à Fianarantsoa",
    description:
      "Broderie représentant le zébu, symbole de prospérité à Madagascar, réalisée point par point par un collectif de brodeuses de Fianarantsoa.",
    stock: 40,
    images: [px(4271729), px(6312053), px(1362385)],
  },
  {
    slug: "vannerie-suspension",
    name: "Suspension en vannerie",
    category: "Maison",
    price: 76000,
    rating: 4.9,
    reviewsCount: 9,
    materials: "Fibre de raphia, armature métal",
    origin: "Tissé à Ambalavao",
    badge: "Nouveau",
    description:
      "Diffuse une lumière chaleureuse et tramée. Structure métallique intérieure pour une tenue parfaite dans le temps.",
    stock: 17,
    images: [px(29193598), px(34667136), px(31794673)],
  },
  {
    slug: "etole-soie-sauvage",
    name: "Étole en soie sauvage",
    category: "Textile",
    price: 88000,
    rating: 4.8,
    reviewsCount: 22,
    materials: "Soie sauvage Landibe",
    origin: "Filée à Soatanana",
    description:
      "Filée à partir du landibe, ver à soie endémique des hauts plateaux. Une matière rare, à la texture légèrement irrégulière et précieuse.",
    stock: 11,
    images: [px(5908326), px(6634454), px(6851135)],
  },
  {
    slug: "plateau-corne-zebu",
    name: "Plateau en corne de zébu",
    category: "Maison",
    price: 39000,
    rating: 4.4,
    reviewsCount: 15,
    materials: "Corne de zébu polie, sous-produit valorisé",
    origin: "Façonné à Antsirabe",
    description:
      "Chaque plateau valorise une corne de zébu issue de la filière alimentaire locale, polie jusqu'à obtenir cette translucidité caractéristique.",
    stock: 26,
    images: [px(10011988), px(4929712), px(10011988)],
  },
];

export const categories = [
  {
    name: "Maison",
    slug: "maison",
    count: products.filter((p) => p.category === "Maison").length,
    image: px(31794673),
  },
  {
    name: "Textile",
    slug: "textile",
    count: products.filter((p) => p.category === "Textile").length,
    image: px(6634454),
  },
  {
    name: "Accessoires",
    slug: "accessoires",
    count: products.filter((p) => p.category === "Accessoires").length,
    image: px(2433862),
  },
];

export const heroImages = {
  primary: px(34667136),
  secondary: px(33476890),
  tertiary: px(2433862),
  story: px(29193598),
  about: px(31794673),
  auth: px(31047257),
};

export const blogPosts = [
  {
    slug: "artisanat-ambalavao-raphia",
    title: "À Ambalavao, le geste du tressage se transmet encore de mère en fille",
    excerpt:
      "Reportage dans les ateliers d'Ambalavao, où la vannerie de raphia reste un savoir-faire vivant, loin des productions standardisées.",
    date: "2026-06-02",
    readTime: "6 min",
    category: "Savoir-faire",
    cover: px(29193598),
  },
  {
    slug: "teintures-vegetales-madagascar",
    title: "Le retour des teintures végétales dans le textile malgache",
    excerpt:
      "Écorces, racines, feuilles : comment une nouvelle génération de tisserands renoue avec des teintures naturelles quasi disparues.",
    date: "2026-05-18",
    readTime: "8 min",
    category: "Matières",
    cover: px(6851135),
  },
  {
    slug: "guide-entretien-raphia",
    title: "Comment entretenir vos objets en raphia pour les faire durer",
    excerpt:
      "Nos conseils simples pour préserver la souplesse et la couleur naturelle de vos pièces tressées au fil des années.",
    date: "2026-04-27",
    readTime: "4 min",
    category: "Guides",
    cover: px(33476890),
  },
];

// ---------------------------------------------------------------- PAIEMENT

export type PaymentMethodId = "mvola" | "orange" | "airtel" | "visa";

export const paymentMethods: {
  id: PaymentMethodId;
  label: string;
  type: "mobile" | "card";
}[] = [
  { id: "mvola", label: "MVola", type: "mobile" },
  { id: "orange", label: "Orange Money", type: "mobile" },
  { id: "airtel", label: "Airtel Money", type: "mobile" },
  { id: "visa", label: "Carte bancaire (Visa / Mastercard)", type: "card" },
];

// ------------------------------------------------------------- COMMANDES

export type OrderStatusStep = { label: string; done: boolean; date?: string };

export type Order = {
  id: string;
  date: string;
  status: "En traitement" | "Expédiée" | "En transit" | "Livrée" | "Annulée";
  total: number;
  paymentMethod: PaymentMethodId;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  lines: { productSlug: string; quantity: number }[];
  timeline: OrderStatusStep[];
};

export const orders: Order[] = [
  {
    id: "MH-10234",
    date: "2026-07-02",
    status: "En transit",
    total: 162000,
    paymentMethod: "mvola",
    trackingNumber: "MG-882910334",
    carrier: "Kaily Express",
    estimatedDelivery: "2026-07-08",
    lines: [
      { productSlug: "panier-raphia-tresse", quantity: 1 },
      { productSlug: "bol-bois-palissandre", quantity: 2 },
    ],
    timeline: [
      { label: "Commande confirmée", done: true, date: "2 juil. 2026" },
      { label: "Préparation en atelier", done: true, date: "3 juil. 2026" },
      { label: "Expédiée", done: true, date: "4 juil. 2026" },
      { label: "En transit", done: false, date: "Estimé 8 juil. 2026" },
      { label: "Livrée", done: false },
    ],
  },
  {
    id: "MH-10198",
    date: "2026-06-18",
    status: "Livrée",
    total: 68000,
    paymentMethod: "orange",
    trackingNumber: "MG-871223981",
    carrier: "Kaily Express",
    lines: [{ productSlug: "vannerie-suspension", quantity: 1 }],
    timeline: [
      { label: "Commande confirmée", done: true, date: "18 juin 2026" },
      { label: "Préparation en atelier", done: true, date: "19 juin 2026" },
      { label: "Expédiée", done: true, date: "20 juin 2026" },
      { label: "En transit", done: true, date: "21 juin 2026" },
      { label: "Livrée", done: true, date: "22 juin 2026" },
    ],
  },
  {
    id: "MH-10143",
    date: "2026-06-03",
    status: "Livrée",
    total: 226000,
    paymentMethod: "visa",
    trackingNumber: "MG-860144207",
    carrier: "Madapost Express",
    lines: [
      { productSlug: "sac-cabas-cuir-raphia", quantity: 1 },
      { productSlug: "etole-soie-sauvage", quantity: 1 },
    ],
    timeline: [
      { label: "Commande confirmée", done: true, date: "3 juin 2026" },
      { label: "Préparation en atelier", done: true, date: "4 juin 2026" },
      { label: "Expédiée", done: true, date: "5 juin 2026" },
      { label: "En transit", done: true, date: "6 juin 2026" },
      { label: "Livrée", done: true, date: "9 juin 2026" },
    ],
  },
  {
    id: "MH-10089",
    date: "2026-05-14",
    status: "Annulée",
    total: 52000,
    paymentMethod: "airtel",
    lines: [{ productSlug: "coussin-brode-zebu", quantity: 1 }],
    timeline: [
      { label: "Commande confirmée", done: true, date: "14 mai 2026" },
      { label: "Annulée à la demande du client", done: true, date: "15 mai 2026" },
    ],
  },
];
