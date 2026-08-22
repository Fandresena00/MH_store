import {
  blogPosts as fallbackBlogPosts,
  categories as fallbackCategories,
  products as fallbackProducts,
  type Order,
  type Product,
} from "@/lib/data";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000"
).replace(/\/$/, "");

type ApiProduct = Omit<Product, "category" | "compareAt" | "images"> & {
  id: number;
  category: { name: string; slug: string };
  compareAtPrice: number | null;
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

const imageBySlug = new Map(
  fallbackProducts.map((product) => [product.slug, product.images]),
);
const imageByBlogSlug = new Map(
  fallbackBlogPosts.map((post) => [post.slug, post.cover]),
);

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { Accept: "application/json", ...(init?.headers ?? {}) },
  });
  if (!response.ok) throw new Error(`API ${response.status}`);
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
    images: imageBySlug.get(product.slug) ?? [],
  };
}

function mapOrder(order: {
  reference: string;
  createdAt: string;
  status: string;
  total: number;
  paymentMethod: string;
  trackingNumber?: string | null;
  items?: { product: ApiProduct; quantity: number }[];
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
    cover: imageByBlogSlug.get(post.slug) ?? "",
  };
}

export async function getProducts(search = ""): Promise<Product[]> {
  try {
    const response = await request<{ data: ApiProduct[] }>(
      `/api/products${search}`,
    );
    return response.data.map(mapProduct);
  } catch {
    return fallbackProducts;
  }
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  try {
    const response = await request<{ data: ApiProduct[] }>(
      `/api/products/featured?limit=${limit}`,
    );
    return response.data.map(mapProduct);
  } catch {
    return fallbackProducts.filter((product) => product.badge).slice(0, limit);
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const response = await request<{ data: ApiProduct }>(
      `/api/products/${encodeURIComponent(slug)}`,
    );
    return mapProduct(response.data);
  } catch {
    return fallbackProducts.find((product) => product.slug === slug) ?? null;
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
      image:
        fallbackCategories.find((item) => item.slug === category.slug)?.image ??
        "",
    }));
  } catch {
    return fallbackCategories;
  }
}

export async function getBlogPosts() {
  try {
    const response = await request<{ data: ApiBlogPost[] }>("/api/blog");
    return response.data.map(mapBlogPost);
  } catch {
    return fallbackBlogPosts;
  }
}

export async function getBlogPost(slug: string) {
  try {
    const response = await request<{ data: ApiBlogPost }>(
      `/api/blog/${encodeURIComponent(slug)}`,
    );
    return mapBlogPost(response.data);
  } catch {
    return fallbackBlogPosts.find((post) => post.slug === slug) ?? null;
  }
}

export async function login(email: string, password: string) {
  const response = await request<{ token: string }>("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem("mh-token", response.token);
  return response.token;
}

export async function register(payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  const response = await request<{ token: string }>("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  localStorage.setItem("mh-token", response.token);
  return response.token;
}

function authHeaders() {
  const token =
    typeof window === "undefined" ? null : localStorage.getItem("mh-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
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
