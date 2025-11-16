import { supabase } from "./supabase/client";

// Helper to get auth token
async function getAuthToken(): Promise<string | null> {
  try {
    const { auth } = await import("./supabase/client");
    const { session } = await auth.getSession();
    return session?.access_token || null;
  } catch (error) {
    // console.error("Failed to get auth token:", error);
    return null;
  }
}

// Helper to check if user is admin
export async function isUserAdmin(): Promise<boolean> {
  try {
    const { auth } = await import("./supabase/client");
    const sessionResult = await auth.getSession();

    // console.log("📊 Session result:", sessionResult);

    if (sessionResult.error) {
      // console.error("❌ Session error:", sessionResult.error);
      return false;
    }

    if (!sessionResult.session?.user?.id) {
      // console.log("❌ No user session found");
      // console.log("Session data:", sessionResult);
      return false;
    }

    const userId = sessionResult.session.user.id;
    const userEmail = sessionResult.session.user.email;

    // Query the users table with proper authentication
    //console.log("📊 Querying users table for user ID:", userId);
    const { data, error } = await supabase
      .from("users")
      .select("role, email, id")
      .eq("id", userId)
      .maybeSingle(); // Use maybeSingle instead of single to handle missing records better

    //console.log("📊 Query result - Data:", data, "Error:", error);

    if (error) {
      // console.error("❌ Database error checking admin status:", error);
      // console.error("Error code:", error.code);
      // console.error("Error message:", error.message);
      // console.error("Error hint:", error.hint);
      // console.error("Error details:", JSON.stringify(error, null, 2));
      return false;
    }

    if (!data) {
      // console.log("❌ No user record found in users table for ID:", userId);
      // console.log(
      //   "⚠️ User exists in auth but not in users table. Creating user record..."
      // );

      // Try to create the user record if it doesn't exist
      try {
        const { data: newUser, error: createError } = await supabase
          .from("users")
          .insert({
            id: userId,
            email: userEmail || "unknown@example.com",
            role: "customer",
          })
          .select("role, email, id")
          .single();

        if (createError) {
          // console.error("❌ Failed to create user record:", createError);
          return false;
        }

        // console.log("✅ Created user record with role:", newUser?.role);
        return newUser?.role === "admin";
      } catch (createErr) {
        //console.error("❌ Exception creating user record:", createErr);
        return false;
      }
    }

    const isAdmin = data.role === "admin";
    // console.log(
    //   "🔍 Role comparison - data.role:",
    //   JSON.stringify(data.role),
    //   'Expected: "admin", Match:',
    //   isAdmin
    // );
    // console.log(
    //   `${isAdmin ? "✅ ADMIN ACCESS GRANTED" : "❌ NOT ADMIN"} - User: ${
    //     data.email
    //   }, Role: ${data.role}`
    // );
    // console.log("🎯 FINAL RETURN VALUE:", isAdmin);

    return isAdmin;
  } catch (error) {
    // console.error("❌ Exception while checking admin status:", error);
    // console.error("Exception details:", JSON.stringify(error, null, 2));
    return false;
  }
}

// ===================
// ANALYTICS
// ===================

export async function getDashboardStats() {
  try {
    // 1️⃣ Get total counts efficiently
    const [
      ordersResult,
      usersResult,
      productsResult,
      eventsResult,
      subscriptionsResult,
    ] = await Promise.all([
      supabase.from("orders").select("*", { count: "exact" }),
      supabase.from("users").select("id", { count: "exact" }),
      supabase.from("products").select("id", { count: "exact" }),
      supabase.from("events").select("id", { count: "exact" }),
      supabase
        .from("subscriptions")
        .select("*", { count: "exact" })
        .eq("status", "active"),
    ]);

    // 2️⃣ Recent orders (limit 5)
    const { data: recentOrders } = await supabase
      .from("orders")
      .select(`*, users (email)`)
      .order("created_at", { ascending: false })
      .limit(5);

    // 3️⃣ Top products by sales
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("product_id, product_name, quantity, price");

    const productSales: Record<string, any> = {};
    orderItems?.forEach((item) => {
      if (!productSales[item.product_id]) {
        productSales[item.product_id] = {
          name: item.product_name,
          sales: 0,
          revenue: 0,
        };
      }
      productSales[item.product_id].sales += item.quantity;
      productSales[item.product_id].revenue +=
        item.quantity * parseFloat(item.price);
    });

    const topProducts = Object.values(productSales)
      .sort((a: any, b: any) => b.sales - a.sales)
      .slice(0, 5);

    // 4️⃣ Monthly revenue (last 12 months)
    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);

    const { data: monthlyOrders } = await supabase
      .from("orders")
      .select("created_at, total, status")
      .gte("created_at", lastYear.toISOString());

    const monthlyRevenue = new Array(12).fill(0);
    monthlyOrders?.forEach((order) => {
      if (order.status !== "cancelled") {
        const monthIndex = new Date(order.created_at).getMonth();
        monthlyRevenue[monthIndex] += parseFloat(order.total || 0);
      }
    });

    // 5️⃣ Total revenue calculation (exclude cancelled orders)
    const totalRevenue =
      monthlyOrders
        ?.filter((o) => o.status !== "cancelled")
        .reduce((sum, o) => sum + parseFloat(o.total || 0), 0) || 0;

    return {
      totalOrders: ordersResult.count || 0,
      totalRevenue,
      totalUsers: usersResult.count || 0,
      totalProducts: productsResult.count || 0,
      totalEvents: eventsResult.count || 0,
      activeSubscriptions: subscriptionsResult.count || 0,
      recentOrders:
        recentOrders?.map((o) => ({
          id: o.id,
          customer: o.users?.email || "Unknown",
          total: o.total,
          status: o.status,
          created_at: o.created_at,
        })) || [],
      topProducts,
      monthlyRevenue,
    };
  } catch (error) {
    console.error("Failed to load dashboard stats:", error);
    throw error;
  }
}

// ===================
// PRODUCTS
// ===================

export async function getAllProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createProduct(product: any) {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, updates: any) {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) throw error;
  return true;
}

// ===================
// ORDERS
// ===================

export async function getAllOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (*),
      users (email)
    `
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function updateOrderStatus(orderId: string, status: string) {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getOrderDetails(orderId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (*),
      users (email)
    `
    )
    .eq("id", orderId)
    .single();

  if (error) throw error;
  return data;
}

// ===================
// USERS
// ===================

export async function getAllUsers() {
  const { data, error } = await supabase
    .from("users")
    .select(
      `
      *,
      profiles (*)
    `
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function updateUserRole(userId: string, newRole: string) {
  const { data, error } = await supabase
    .from("users")
    .update({ role: newRole })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserStatus(userId: string, newStatus: string) {
  const { data, error } = await supabase
    .from("users")
    .update({ status: newStatus })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteUser(userId: string) {
  const { error } = await supabase.from("users").delete().eq("id", userId);

  if (error) throw error;
  return true;
}

// ===================
// EVENTS
// ===================

export async function getAllEvents() {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createEvent(event: any) {
  const { data, error } = await supabase
    .from("events")
    .insert(event)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateEvent(id: string, updates: any) {
  const { data, error } = await supabase
    .from("events")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteEvent(id: string) {
  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) throw error;
  return true;
}

export async function getEventRegistrations(eventId: string) {
  const { data, error } = await supabase
    .from("event_registrations")
    .select(
      `
      *,
      users (email),
      events (title)
    `
    )
    .eq("event_id", eventId);

  if (error) throw error;
  return data || [];
}

// ===================
// SUBSCRIPTIONS && PLANS
// ===================

export async function getAllSubscriptions() {
  const { data, error } = await supabase
    .from("subscriptions")
    .select(
      `
      *,
      users (email)
    `
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createSubscription(subscription: any) {
  const { data, error } = await supabase
    .from("subscriptions")
    .insert(subscription)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateSubscription(id: string, updates: any) {
  const { data, error } = await supabase
    .from("subscriptions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSubscription(id: string) {
  const { error } = await supabase
    .from("subscription_plans")
    .delete()
    .eq("id", id);
  if (error) throw error;
  return true;
}

export async function getAllSubscriptionPlans() {
  const { data, error } = await supabase
    .from("subscription_plan")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createSubscriptionPlan(plan: any) {
  const { data, error } = await supabase
    .from("subscription_plan")
    .insert(plan)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateSubscriptionPlan(id: string, updates: any) {
  const { data, error } = await supabase
    .from("subscription_plan")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSubscriptionPlan(id: string) {
  const { error } = await supabase
    .from("subscription_plan")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}

// ===================
// OFFERS & PROMOTIONS
// ===================

export async function getAllOffers() {
  const { data, error } = await supabase
    .from("offers")
    .select(
      `
      *,
      products (name)
    `
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createOffer(offer: any) {
  const { data, error } = await supabase
    .from("offers")
    .insert(offer)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateOffer(id: string, updates: any) {
  const { data, error } = await supabase
    .from("offers")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteOffer(id: string) {
  const { error } = await supabase.from("offers").delete().eq("id", id);

  if (error) throw error;
  return true;
}

export async function getAllPromotions() {
  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createPromotion(promotion: any) {
  const { data, error } = await supabase
    .from("promotions")
    .insert(promotion)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePromotion(id: string, updates: any) {
  const { data, error } = await supabase
    .from("promotions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePromotion(id: string) {
  const { error } = await supabase.from("promotions").delete().eq("id", id);

  if (error) throw error;
  return true;
}

// ===================
// BLOG POSTS
// ===================

export async function getAllBlogPosts() {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createBlogPost(post: any) {
  const { data, error } = await supabase
    .from("blog_posts")
    .insert(post)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBlogPost(id: string, updates: any) {
  const { data, error } = await supabase
    .from("blog_posts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBlogPost(id: string) {
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  if (error) throw error;
  return true;
}

// ===================
// BANNERS
// ===================

export async function getAllBanners() {
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createBanner(banner: any) {
  const { data, error } = await supabase
    .from("banners")
    .insert(banner)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBanner(id: string, updates: any) {
  const { data, error } = await supabase
    .from("banners")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBanner(id: string) {
  const { error } = await supabase.from("banners").delete().eq("id", id);

  if (error) throw error;
  return true;
}

// ===================
// REVIEWS
// ===================

export async function getAllReviews() {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
      *,
      products (name),
      users (email)
    `
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function deleteReview(id: string) {
  const { error } = await supabase.from("reviews").delete().eq("id", id);

  if (error) throw error;
  return true;
}
