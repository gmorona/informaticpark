const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
const API_URL = `${BACKEND_URL}/api`;

async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  let token = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  // Ensure endpoint doesn't double slash or miss slash
  const url = `${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined" && !url.includes("/auth/login")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    const error = await response.json().catch(() => ({ message: "An error occurred" }));
    throw new Error(error.message || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}


export const api = {
  auth: {
    login: (credentials: any) => fetcher<any>("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  },
  users: {
    getAll: () => fetcher<any[]>("/users"),
    getById: (id: number) => fetcher<any>(`/users/${id}`),
    create: (data: any) => fetcher<any>("/users", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: any) => fetcher<any>(`/users/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: number) => fetcher<void>(`/users/${id}`, { method: "DELETE" }),
  },
  custodians: {
    getAll: () => fetcher<any[]>("/custodians"),
    getById: (id: number) => fetcher<any>(`/custodians/${id}`),
    create: (data: any) => fetcher<any>("/custodians", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: any) => fetcher<any>(`/custodians/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: number) => fetcher<void>(`/custodians/${id}`, { method: "DELETE" }),
  },
  assets: {
    getAll: () => fetcher<any[]>("/assets"),
    getById: (id: number) => fetcher<any>(`/assets/${id}`),
    create: (data: any) => fetcher<any>("/assets", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: any) => fetcher<any>(`/assets/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: number) => fetcher<void>(`/assets/${id}`, { method: "DELETE" }),
  },
};

