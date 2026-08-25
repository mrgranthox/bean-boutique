import { env } from "./env";
import { supabase } from "./supabase/client";

const API_BASE_URL = env.supabase.apiUrl;

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
  requireAuth?: boolean;
}

// Get auth token from Supabase client
export async function getAuthToken(): Promise<string | null> {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      //console.warn("Auth session error:", error.message);
      return null;
    }

    let session = data?.session;

    // If there's no session, try to refresh it
    if (!session) {
      const { data: refreshed, error: refreshError } =
        await supabase.auth.refreshSession();

      if (refreshError) {
        //console.warn("Auth refresh error:", refreshError.message);
        return null;
      }

      session = refreshed?.session;
    }

    if (!session?.access_token) {
      // console.warn("No access token found in session");
      return null;
    }

    return session.access_token;
  } catch (err) {
    console.warn("Failed to get auth token:", err);
    return null;
  }
}

async function apiCall(endpoint: string, options: ApiOptions = {}) {
  const { method = "GET", headers = {}, body, requireAuth = false } = options;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${env.supabase.anonKey}`,
  };

  // If auth is required, use the user's access token
  if (requireAuth) {
    const authToken = await getAuthToken();
    if (authToken) {
      defaultHeaders["Authorization"] = `Bearer ${authToken}`;
    } else {
      throw new Error("Authentication required but no valid token found");
    }
  }

  const finalHeaders = { ...defaultHeaders, ...headers };

  const config: RequestInit = {
    method,
    headers: finalHeaders,
  };

  if (body && method !== "GET") {
    config.body = JSON.stringify(body);
  }

  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), env.apiTimeout);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: `Request failed with status ${response.status}`,
      }));
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.error(`API call timeout for ${endpoint}`);
        throw new Error(
          "Request timed out. Please check your connection and try again."
        );
      }
      if (error.message.includes("Failed to fetch")) {
        console.error(`Network error for ${endpoint}:`, error.message);
        throw new Error(
          "Network error. Please check your connection and try again."
        );
      }
      console.error(`API call failed for ${endpoint}:`, error.message);
      throw error;
    }
    console.error(`API call failed for ${endpoint}:`, error);
    throw new Error("An unexpected error occurred. Please try again.");
  }
}

// Authentication APIs
export const authApi = {
  signup: (email: string, password: string, name: string) =>
    apiCall("/auth/signup", {
      method: "POST",
      body: { email, password, name },
    }),
};

// Products APIs
export const productsApi = {
  getProducts: (params?: {
    category?: string;
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    return apiCall(`/products?${searchParams}`);
  },

  getProduct: (id: string) => apiCall(`/products/${id}`),
};

// Cart APIs with improved timeout handling
export const cartApi = {
  getCart: async () => {
    try {
      return await apiCall("/cart", { requireAuth: true });
    } catch (error) {
      // If cart fetch fails, return empty cart instead of throwing
      if (
        error instanceof Error &&
        (error.message.includes("timeout") ||
          error.message.includes("timed out"))
      ) {
        console.warn("Cart fetch timed out, returning empty cart");
        return {
          cart: { items: [], total: 0, updated_at: new Date().toISOString() },
        };
      }
      throw error;
    }
  },

  addToCart: (productOrId: string | any, quantity: number = 1) => {
    // Extract product ID from object or use as string
    const productId =
      typeof productOrId === "object" && productOrId?.id
        ? productOrId.id
        : productOrId;

    if (!productId || typeof productId !== "string") {
      throw new Error(`Invalid product ID: ${JSON.stringify(productOrId)}`);
    }

    return apiCall("/cart/add", {
      method: "POST",
      body: { productId, quantity },
      requireAuth: true,
    });
  },

  updateQuantity: (productId: string, quantity: number) =>
    apiCall("/cart/update", {
      method: "PUT",
      body: { productId, quantity },
      requireAuth: true,
    }),

  removeFromCart: (productId: string) =>
    apiCall(`/cart/remove/${productId}`, {
      method: "DELETE",
      requireAuth: true,
    }),
};

// Orders APIs
export const ordersApi = {
  createOrder: (orderData: any) =>
    apiCall("/orders", {
      method: "POST",
      body: orderData,
      requireAuth: true,
    }),

  getOrders: () => apiCall("/orders", { requireAuth: true }),
};

// Events APIs
export const eventsApi = {
  getEvents: (params?: {
    category?: string;
    difficulty?: string;
    upcoming?: boolean;
    featured?: boolean;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    return apiCall(`/events?${searchParams}`);
  },

  getEvent: (id: string) => apiCall(`/events/${id}`),

  registerForEvent: (eventId: string, registrationData: any) =>
    apiCall(`/events/${eventId}/register`, {
      method: "POST",
      body: registrationData,
      requireAuth: true,
    }),
};

// Offers APIs
export const offersApi = {
  getOffers: (params?: {
    category?: string;
    type?: string;
    active?: boolean;
    featured?: boolean;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    return apiCall(`/offers?${searchParams}`);
  },

  getOffer: (id: string) => apiCall(`/offers/${id}`),
};

// Subscriptions APIs - Merged from duplicate definitions
export const subscriptionsApi = {
  // Subscription Plans
  getSubscriptionPlans: () => apiCall("/subscription-plans"),
  getSubscriptionPlan: (id: string) => apiCall(`/subscription-plans/${id}`),

  // User Subscriptions
  getSubscriptions: () => apiCall("/subscriptions", { requireAuth: true }),
  getUserSubscriptions: () =>
    apiCall("/subscriptions/me", { requireAuth: true }),

  // Create/Subscribe
  subscribe: (subscriptionData: any) =>
    apiCall("/subscriptions", {
      method: "POST",
      body: subscriptionData,
      requireAuth: true,
    }),
  createSubscription: (subscriptionData: any) =>
    apiCall("/subscriptions", {
      method: "POST",
      body: subscriptionData,
      requireAuth: true,
    }),

  // Update/Cancel
  updateSubscription: (subscriptionId: string, updateData: any) =>
    apiCall(`/subscriptions/${subscriptionId}`, {
      method: "PUT",
      body: updateData,
      requireAuth: true,
    }),
  cancelSubscription: (subscriptionId: string) =>
    apiCall(`/subscriptions/${subscriptionId}/cancel`, {
      method: "PUT",
      requireAuth: true,
    }),
};

// Newsletter APIs
export const newsletterApi = {
  subscribe: (email: string, preferences: any = {}) =>
    apiCall("/newsletter/subscribe", {
      method: "POST",
      body: { email, preferences },
    }),
};

// Reviews APIs
export const reviewsApi = {
  createReview: (reviewData: any) =>
    apiCall("/reviews", {
      method: "POST",
      body: reviewData,
      requireAuth: true,
    }),

  getProductReviews: (productId: string) => apiCall(`/reviews/${productId}`),
};

// Admin APIs
export const adminApi = {
  initializeData: async (): Promise<{ success: boolean; message: string; error?: string }> => {
    return { success: true, message: "Data initialized" };
  },

  // Dashboard Stats (Analytics)
  getStats: () => apiCall("/admin/analytics"),

  // Product Management
  getProducts: () => apiCall("/products", { requireAuth: true }),
  createProduct: (productData: any) =>
    apiCall("/products", {
      method: "POST",
      body: productData,
      requireAuth: true,
    }),
  updateProduct: (id: string, productData: any) =>
    apiCall(`/products/${id}`, {
      method: "PUT",
      body: productData,
      requireAuth: true,
    }),
  deleteProduct: (id: string) =>
    apiCall(`/products/${id}`, {
      method: "DELETE",
      requireAuth: true,
    }),

  // Order Management
  getOrders: () => apiCall("/admin/orders", { requireAuth: true }),
  updateOrderStatus: (orderId: string, status: string) =>
    apiCall(`/admin/orders/${orderId}/status`, {
      method: "PUT",
      body: { status },
      requireAuth: true,
    }),

  // Event Management
  getEvents: () => apiCall("/admin/events", { requireAuth: true }),
  createEvent: (eventData: any) =>
    apiCall("/admin/events", {
      method: "POST",
      body: eventData,
      requireAuth: true,
    }),
  updateEvent: (id: string, eventData: any) =>
    apiCall(`/admin/events/${id}`, {
      method: "PUT",
      body: eventData,
      requireAuth: true,
    }),
  deleteEvent: (id: string) =>
    apiCall(`/admin/events/${id}`, {
      method: "DELETE",
      requireAuth: true,
    }),

  // User Management
  getUsers: () => apiCall("/admin/users", { requireAuth: true }),
  updateUser: (id: string, updates: any) =>
    apiCall(`/admin/users/${id}`, {
      method: "PUT",
      body: updates,
      requireAuth: true,
    }),
};

// Profile APIs
export const profileApi = {
  getProfile: () => apiCall("/profile", { requireAuth: true }),

  updateProfile: (profileData: any) =>
    apiCall("/profile", {
      method: "PUT",
      body: profileData,
      requireAuth: true,
    }),

  addAddress: (addressData: any) =>
    apiCall("/profile/addresses", {
      method: "POST",
      body: addressData,
      requireAuth: true,
    }),

  updateAddress: (addressId: string, addressData: any) =>
    apiCall(`/profile/addresses/${addressId}`, {
      method: "PUT",
      body: addressData,
      requireAuth: true,
    }),

  deleteAddress: (addressId: string) =>
    apiCall(`/profile/addresses/${addressId}`, {
      method: "DELETE",
      requireAuth: true,
    }),
};

// Health check
export const healthApi = {
  check: () => apiCall("/health"),
};
