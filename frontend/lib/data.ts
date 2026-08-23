export type Product = {
  id?: number;
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
  lines: {
    productSlug: string;
    quantity: number;
    productName?: string;
    unitPrice?: number;
    image?: string;
  }[];
  timeline: OrderStatusStep[];
};
