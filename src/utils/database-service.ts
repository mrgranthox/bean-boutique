/**
 * Database Service - Unified data access layer
 * Replaces all mock data with real database queries
 */

import { supabase } from "./supabase/client";

// ==========================================
// PRODUCTS
// ==========================================

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sale_price?: number;
  stock: number;
  image_url: string;
  category: string;
  subcategory?: string;

  // Coffee-specific fields
  origin?: string;
  roast_level?: string;
  flavor_notes?: string[];
  processing_method?: string;
  altitude?: string;
  isOrganic: unknown;
  tastingNotes: any;

  // Equipment-specific fields
  brand?: string;
  model?: string;
  type?: string;
  bestseller: boolean;

  // Common fields
  featured?: boolean;
  rating?: number;
  new: boolean;
  review_count?: number;
  tags?: string[];
  image: string;
  created_at?: string;
  updated_at?: string;
  isFairTrade: unknown;
  certification: any;
}

export async function getProducts(options?: {
  category?: string;
  subcategory?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
  search?: string;
}): Promise<{ data: Product[]; total: number; error?: any }> {
  try {
    let query = supabase
      .from("products")
      .select("*", { count: "exact" })
      .gt("stock", 0);

    if (options?.category) {
      query = query.eq("category", options.category);
    }

    if (options?.subcategory) {
      query = query.eq("subcategory", options.subcategory);
    }

    if (options?.featured) {
      query = query.eq("featured", true);
    }

    if (options?.search) {
      query = query.or(
        `name.ilike.%${options.search}%,description.ilike.%${options.search}%`
      );
    }

    query = query.order("created_at", { ascending: false });

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1
      );
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching products:", error);
      return { data: [], total: 0, error };
    }

    return { data: data || [], total: count || 0 };
  } catch (error) {
    console.error("Exception fetching products:", error);
    return { data: [], total: 0, error };
  }
}

export async function getProductById(
  id: string
): Promise<{ data: Product | null; error?: any }> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching product:", error);
      return { data: null, error };
    }

    return { data };
  } catch (error) {
    console.error("Exception fetching product:", error);
    return { data: null, error };
  }
}

// ==========================================
// EVENTS
// ==========================================

export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  duration: string;
  location: string;
  category: string;
  image_url: string;
  price: number;
  capacity: number;
  enrolled: number;
  instructor?: string;
  level?: string;
  materials_included?: string[];
  featured?: boolean;
  requirements?: string[];
  created_at?: string;
}

export async function getEvents(options?: {
  category?: string;
  upcoming?: boolean;
  limit?: number;
  offset?: number;
}): Promise<{ data: Event[]; total: number; error?: any }> {
  try {
    let query = supabase.from("events").select("*", { count: "exact" });

    if (options?.category) {
      query = query.eq("category", options.category);
    }

    if (options?.upcoming) {
      const now = new Date().toISOString();
      query = query.gte("event_date", now);
    }

    query = query.order("event_date", { ascending: true });

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1
      );
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching events:", error);
      return { data: [], total: 0, error };
    }

    return { data: data || [], total: count || 0 };
  } catch (error) {
    console.error("Exception fetching events:", error);
    return { data: [], total: 0, error };
  }
}

export async function getEventById(
  id: string
): Promise<{ data: Event | null; error?: any }> {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching event:", error);
      return { data: null, error };
    }

    return { data };
  } catch (error) {
    console.error("Exception fetching event:", error);
    return { data: null, error };
  }
}

// ==========================================
// OFFERS & PROMOTIONS
// ==========================================

export interface Offer {
  id: string;
  product_id?: string;
  title: string;
  description?: string;
  discount_percent?: number;
  discount_value?: number;
  code?: string;
  min_purchase?: number;
  active: boolean;
  start_date: string;
  end_date?: string;
  created_at?: string;
}

export async function getOffers(options?: {
  active?: boolean;
  limit?: number;
}): Promise<{ data: Offer[]; total: number; error?: any }> {
  try {
    let query = supabase.from("offers").select("*", { count: "exact" });

    if (options?.active) {
      query = query.eq("active", true);
      const now = new Date().toISOString();
      query = query.lte("start_date", now);
      // Only filter by end_date if it's not null
      query = query.or(`end_date.is.null,end_date.gte.${now}`);
    }

    query = query.order("created_at", { ascending: false });

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching offers:", error);
      return { data: [], total: 0, error };
    }

    return { data: data || [], total: count || 0 };
  } catch (error) {
    console.error("Exception fetching offers:", error);
    return { data: [], total: 0, error };
  }
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  code?: string;
  discount_type: string;
  discount_value: number;
  start_date: string;
  end_date: string;
  active: boolean;
  usage_limit?: number;
  usage_count?: number;
  created_at?: string;
}

export async function getPromotions(options?: {
  active?: boolean;
  limit?: number;
}): Promise<{ data: Promotion[]; total: number; error?: any }> {
  try {
    let query = supabase.from("promotions").select("*", { count: "exact" });

    if (options?.active) {
      const now = new Date().toISOString();
      query = query
        .eq("active", true)
        .lte("start_date", now)
        .gte("end_date", now);
    }

    query = query.order("created_at", { ascending: false });

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching promotions:", error);
      return { data: [], total: 0, error };
    }

    return { data: data || [], total: count || 0 };
  } catch (error) {
    console.error("Exception fetching promotions:", error);
    return { data: [], total: 0, error };
  }
}

// ==========================================
// SUBSCRIPTIONS
// ==========================================

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billing_period: string;
  features: string[];
  popular?: boolean;
  delivery_frequency?: string;
  bag_size?: string;
  customization_options?: string[];
  created_at?: string;
}

export async function getSubscriptionPlans(): Promise<{
  data: SubscriptionPlan[];
  error?: any;
}> {
  try {
    // For now, return predefined subscription plans
    // In future, this could come from a subscriptions_plans table
    // const plans: SubscriptionPlan[] = [
    //   {
    //     id: "starter",
    //     name: "Starter",
    //     description: "Perfect for occasional coffee lovers",
    //     price: 19.99,
    //     billing_period: "monthly",
    //     delivery_frequency: "Monthly",
    //     bag_size: "12 oz",
    //     features: [
    //       "12 oz bag per month",
    //       "Choose from 5 signature blends",
    //       "Free shipping",
    //       "Cancel anytime",
    //     ],
    //     customization_options: ["Grind preference", "Roast level"],
    //   },
    //   {
    //     id: "enthusiast",
    //     name: "Enthusiast",
    //     description: "For true coffee enthusiasts",
    //     price: 34.99,
    //     billing_period: "monthly",
    //     delivery_frequency: "Bi-weekly",
    //     bag_size: "16 oz",
    //     popular: true,
    //     features: [
    //       "2x 16 oz bags per month",
    //       "Access to limited editions",
    //       "Tasting notes included",
    //       "Priority support",
    //       "Free shipping",
    //     ],
    //     customization_options: [
    //       "Grind preference",
    //       "Roast level",
    //       "Flavor profile",
    //       "Origin preference",
    //     ],
    //   },
    //   {
    //     id: "connoisseur",
    //     name: "Connoisseur",
    //     description: "Ultimate coffee experience",
    //     price: 59.99,
    //     billing_period: "monthly",
    //     delivery_frequency: "Weekly",
    //     bag_size: "20 oz",
    //     features: [
    //       "4x 20 oz bags per month",
    //       "Exclusive micro-lots",
    //       "Virtual tasting sessions",
    //       "Personalized recommendations",
    //       "Free express shipping",
    //       "Early access to new releases",
    //     ],
    //     customization_options: [
    //       "Grind preference",
    //       "Roast level",
    //       "Flavor profile",
    //       "Origin preference",
    //       "Processing method",
    //     ],
    //   },
    // ];

    const { data, error } = await supabase
      .from("subscription_plan")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching subscription plans:", error);
      return { data: [], error };
    }

    const plans = data || [];

    return { data: plans };
  } catch (error) {
    console.error("Exception fetching subscription plans:", error);
    return { data: [], error };
  }
}

// ==========================================
// BANNERS (for hero carousel)
// ==========================================

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  cta_text?: string;
  cta_link?: string;
  active: boolean;
  sort_order: number;
  background_color?: string;
  text_color?: string;
  created_at?: string;
}

export async function getBanners(options?: {
  active?: boolean;
}): Promise<{ data: Banner[]; error?: any }> {
  try {
    let query = supabase.from("banners").select("*");

    if (options?.active !== false) {
      query = query.eq("active", true);
    }

    query = query.order("sort_order", { ascending: true });

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching banners:", error);
      return { data: [], error };
    }

    return { data: data || [] };
  } catch (error) {
    console.error("Exception fetching banners:", error);
    return { data: [], error };
  }
}

// ==========================================
// BLOG POSTS
// ==========================================

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  author: string;
  category: string;
  tags?: string[];
  published: boolean;
  created_at: string;
  updated_at?: string;
}

export async function getBlogPosts(options?: {
  published?: boolean;
  category?: string;
  limit?: number;
  offset?: number;
}): Promise<{ data: BlogPost[]; total: number; error?: any }> {
  try {
    let query = supabase.from("blog_posts").select("*", { count: "exact" });

    if (options?.published !== false) {
      query = query.eq("published", true);
    }

    if (options?.category) {
      query = query.eq("category", options.category);
    }

    query = query.order("created_at", { ascending: false });

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1
      );
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching blog posts:", error);
      return { data: [], total: 0, error };
    }

    return { data: data || [], total: count || 0 };
  } catch (error) {
    console.error("Exception fetching blog posts:", error);
    return { data: [], total: 0, error };
  }
}

// ==========================================
// REVIEWS
// ==========================================

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title?: string;
  comment: string;
  verified_purchase: boolean;
  helpful_count?: number;
  created_at: string;
  users?: {
    email: string;
  };
}

export async function getProductReviews(
  productId: string,
  options?: {
    limit?: number;
    offset?: number;
  }
): Promise<{
  data: Review[];
  total: number;
  averageRating: number;
  error?: any;
}> {
  try {
    let query = supabase
      .from("reviews")
      .select("*, users(email)", { count: "exact" })
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1
      );
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching reviews:", error);
      return { data: [], total: 0, averageRating: 0, error };
    }

    const reviews = data || [];
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return { data: reviews, total: count || 0, averageRating };
  } catch (error) {
    console.error("Exception fetching reviews:", error);
    return { data: [], total: 0, averageRating: 0, error };
  }
}

// ==========================================
// STATISTICS
// ==========================================

export async function getStatistics() {
  try {
    const [productsCount, eventsCount, ordersCount, usersCount] =
      await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("users").select("id", { count: "exact", head: true }),
      ]);

    return {
      products: productsCount.count || 0,
      events: eventsCount.count || 0,
      orders: ordersCount.count || 0,
      users: usersCount.count || 0,
    };
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return { products: 0, events: 0, orders: 0, users: 0 };
  }
}

// ==========================================
// USER PROFILE & AUTH
// ==========================================

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  date_of_birth?: string;
  role: "customer" | "admin" | "moderator";
  status: "active" | "inactive" | "banned";
  avatar?: string;
  preferences: {
    newsletter: boolean;
    promotions: boolean;
    orderUpdates: boolean;
  };
  stats: {
    totalOrders: number;
    totalSpent: number;
    lastOrderDate?: string;
    subscriptions: number;
  };
  createdAt: string;
  lastLoginAt?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<{ data: UserProfile | null; error?: any }> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error updating user profile:", error);
      return { data: null, error };
    }

    return { data };
  } catch (error) {
    console.error("Exception updating user profile:", error);
    return { data: null, error };
  }
}

export async function getUserOrders(
  userId: string
): Promise<{ data: any[]; error?: any }> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(`*, order_items(*)`)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user orders:", error);
      return { data: [], error };
    }

    return { data: data || [] };
  } catch (error) {
    console.error("Exception fetching user orders:", error);
    return { data: [], error };
  }
}

export async function updateUserPreferences(
  userId: string,
  preferences: Partial<UserProfile["preferences"]>
): Promise<{ data: UserProfile | null; error?: any }> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({ preferences })
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error updating user preferences:", error);
      return { data: null, error };
    }

    return { data };
  } catch (error) {
    console.error("Exception updating user preferences:", error);
    return { data: null, error };
  }
}

export async function getUserSubscriptions(
  userId: string
): Promise<{ data: any[]; error?: any }> {
  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user subscriptions:", error);
      return { data: [], error };
    }

    return { data: data || [] };
  } catch (error) {
    console.error("Exception fetching user subscriptions:", error);
    return { data: [], error };
  }
}

export async function updateUserAddress(
  userId: string,
  address: Partial<UserProfile["address"]>
): Promise<{ data: UserProfile | null; error?: any }> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({ address })
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error updating user address:", error);
      return { data: null, error };
    }

    return { data };
  } catch (error) {
    console.error("Exception updating user address:", error);
    return { data: null, error };
  }
}

export async function deleteUserAddress(
  userId: string
): Promise<{ data: UserProfile | null; error?: any }> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({ addresses: [] })
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error deleting user address:", error);
      return { data: null, error };
    }

    return { data };
  } catch (error) {
    console.error("Exception deleting user address:", error);
    return { data: null, error };
  }
}

export async function getUserProfileData(userId: string) {
  const [profileRes, ordersRes, subscriptionsRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
    getUserOrders(userId),
    getUserSubscriptions(userId),
  ]);

  return {
    profile: profileRes.data,
    orders: ordersRes.data,
    subscriptions: subscriptionsRes.data,
  };
}
