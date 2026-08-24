import { Order, Product } from "./data";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function mediaUrl(path: string | null | undefined): string {
  return path ? `${API_URL}${path}` : "";
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

type ApiProduct = Omit<Product, "category" | "compareAt" | "images"> & {
  id: number;
  category: { name: string; slug: string };
  compareAtPrice: number | null;
  image?: string | null;
  colorFrom?: string;
  colorTo?: string;
};

type ApiBlogPost = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: number;
  publishedAt: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL is not configured");

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { Accept: "application/json", ...(init?.headers ?? {}) },
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as {
      error?: string;
      message?: string;
    };
    throw new ApiError(
      body.error ?? body.message ?? `API ${response.status}`,
      response.status,
    );
  }
  return response.json() as Promise<T>;
}

function mapProduct(product: ApiProduct): Product {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category?.name ?? "Autres",
    price: product.price,
    compareAt: product.compareAtPrice ?? undefined,
    rating: product.rating,
    reviewsCount: product.reviewsCount,
    materials: product.materials,
    origin: product.origin,
    badge: product.badge as Product["badge"],
    description: product.description,
    stock: product.stock,
    images: product.image ? [mediaUrl(product.image)] : [],
  };
}

function mapOrder(order: {
  reference: string;
  createdAt: string;
  status: string;
  total: number;
  paymentMethod: string;
  trackingNumber?: string | null;
  items?: { product: ApiProduct; quantity: number; unitPrice: number }[];
}): Order {
  const statusMap: Record<string, Order["status"]> = {
    confirmed: "En traitement",
    preparing: "En traitement",
    shipped: "Expédiée",
    in_transit: "En transit",
    delivered: "Livrée",
    cancelled: "Annulée",
  };
  return {
    id: order.reference,
    date: order.createdAt,
    status: statusMap[order.status] ?? "En traitement",
    total: order.total,
    paymentMethod: ({
      MVOLA: "mvola",
      ORANGE_MONEY: "orange",
      ARTEL_MONEY: "airtel",
      BRED: "visa",
    }[order.paymentMethod] ?? "mvola") as Order["paymentMethod"],
    trackingNumber: order.trackingNumber ?? undefined,
    lines: (order.items ?? []).map((item) => ({
      productSlug: item.product.slug,
      quantity: item.quantity,
      productName: item.product.name,
      unitPrice: item.unitPrice,
      image: "",
    })),
    timeline: [
      {
        label: "Commande confirmée",
        done: true,
        date: new Date(order.createdAt).toLocaleDateString("fr-FR"),
      },
      {
        label: "Préparation en atelier",
        done: ["preparing", "shipped", "in_transit", "delivered"].includes(
          order.status,
        ),
      },
      {
        label: "Expédiée",
        done: ["shipped", "in_transit", "delivered"].includes(order.status),
      },
      {
        label: "En transit",
        done: ["in_transit", "delivered"].includes(order.status),
      },
      { label: "Livrée", done: order.status === "delivered" },
    ],
  };
}

function mapBlogPost(post: ApiBlogPost) {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.publishedAt,
    readTime: `${post.readTime} min`,
    category: post.category,
    cover: "",
  };
}

export async function getProducts(search = ""): Promise<Product[]> {
  try {
    const response = await request<{ data: ApiProduct[] }>(
      `/api/products${search}`,
    );
    return response.data.map(mapProduct);
  } catch {
    return [];
  }
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  try {
    const response = await request<{ data: ApiProduct[] }>(
      `/api/products/featured?limit=${limit}`,
    );
    return response.data.map(mapProduct);
  } catch {
    return [];
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const response = await request<{ data: ApiProduct }>(
      `/api/products/${encodeURIComponent(slug)}`,
    );
    return mapProduct(response.data);
  } catch {
    return null;
  }
}

export async function getCategories() {
  try {
    const response = await request<{
      data: { name: string; slug: string; productCount: number }[];
    }>("/api/categories");
    return response.data.map((category) => ({
      ...category,
      count: category.productCount,
      image: "",
    }));
  } catch {
    return [];
  }
}

export async function getBlogPosts() {
  try {
    const response = await request<{ data: ApiBlogPost[] }>("/api/blog");
    return response.data.map(mapBlogPost);
  } catch {
    return [];
  }
}

export async function getBlogPost(slug: string) {
  try {
    const response = await request<{ data: ApiBlogPost }>(
      `/api/blog/${encodeURIComponent(slug)}`,
    );
    return mapBlogPost(response.data);
  } catch {
    return null;
  }
}

export async function login(email: string, password: string) {
  const response = await request<{ token: string }>("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem("mh-token", response.token);
  window.dispatchEvent(new Event("mh-auth-changed"));
  return response.token;
}

export async function register(payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  return request<{ message: string; email: string }>("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function verifyEmail(token: string) {
  return request<{ message: string }>(
    `/api/auth/verify-email?token=${encodeURIComponent(token)}`,
  );
}

export function logout() {
  localStorage.removeItem("mh-token");
  window.dispatchEvent(new Event("mh-auth-changed"));
}

function authHeaders(): Record<string, string> {
  const token =
    typeof window === "undefined" ? null : localStorage.getItem("mh-token");
  if (!token) return {};

  return { Authorization: `Bearer ${token}` };
}

export async function getCurrentUser() {
  return request<{
    data: {
      fullName: string;
      email: string;
      phone: string | null;
      createdAt: string;
    };
  }>("/api/me", { headers: authHeaders() });
}

export type AccountAddress = {
  id: number;
  label: string;
  fullName: string;
  line1: string;
  city: string;
  phone: string;
};

export type Account = {
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  createdAt: string;
  addresses: AccountAddress[];
};

export async function getAccount(): Promise<Account> {
  const response = await request<{ data: Account }>("/api/account", {
    headers: authHeaders(),
  });
  return response.data;
}

export async function updateAccount(payload: {
  firstName: string;
  lastName: string;
  phone: string;
}) {
  const response = await request<{ data: Account }>("/api/account", {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function createAddress(payload: Omit<AccountAddress, "id">) {
  const response = await request<{ data: AccountAddress }>(
    "/api/account/addresses",
    {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    },
  );
  return response.data;
}

export async function updateAddress(
  id: number,
  payload: Omit<AccountAddress, "id">,
) {
  const response = await request<{ data: AccountAddress }>(
    `/api/account/addresses/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    },
  );
  return response.data;
}

export async function deleteAddress(id: number) {
  await request(`/api/account/addresses/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

export async function getAccountOrders() {
  const response = await request<{ data: Parameters<typeof mapOrder>[0][] }>(
    "/api/account/orders",
    { headers: authHeaders() },
  );
  return { data: response.data.map(mapOrder) };
}

export async function getOrder(reference: string) {
  const response = await request<{ data: Parameters<typeof mapOrder>[0] }>(
    `/api/orders/${encodeURIComponent(reference)}`,
  );
  return { data: mapOrder(response.data) };
}

export async function checkout(payload: Record<string, unknown>) {
  return request<{ reference: string; total: number; paymentLink: string }>(
    "/api/checkout",
    {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    },
  );
}

export async function sendContact(payload: {
  name: string;
  email: string;
  message: string;
}) {
  return request<{ status: string; message: string }>("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
