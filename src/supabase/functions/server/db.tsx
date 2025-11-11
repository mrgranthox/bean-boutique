/**
 * Database utilities for Bean Boutique
 * Provides helper functions for common database operations
 */

import { createClient } from "jsr:@supabase/supabase-js@2";

// Create Supabase client with Service Role (bypass RLS)
export function createServiceClient() {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
}

// Create Supabase client with user token (respects RLS)
export function createUserClient(accessToken: string) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  );
  
  // Set the user's access token
  supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: '',
  });
  
  return supabase;
}

// ==================
// USER UTILITIES
// ==================

export async function getUserFromToken(accessToken: string) {
  const supabase = createServiceClient();
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  
  if (error || !user) {
    return null;
  }
  
  return user;
}

export async function isAdmin(userId: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();
    
  if (error || !data) {
    return false;
  }
  
  return data.role === 'admin';
}

export async function createUserRecord(userId: string, email: string, role: string = 'user') {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase
    .from('users')
    .insert({
      id: userId,
      email: email,
      role: role,
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error creating user record:', error);
    return null;
  }
  
  return data;
}

export async function createUserProfile(userId: string, fullName?: string) {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      user_id: userId,
      full_name: fullName || null,
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error creating user profile:', error);
    return null;
  }
  
  return data;
}

// ==================
// PRODUCT UTILITIES
// ==================

export async function getAllProducts(category?: string, featured?: boolean) {
  const supabase = createServiceClient();
  
  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (category) {
    query = query.eq('category', category);
  }
  
  if (featured !== undefined) {
    query = query.eq('featured', featured);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  
  return data || [];
}

export async function getProductById(id: string) {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }
  
  return data;
}

export async function createProduct(product: any) {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();
    
  if (error) {
    console.error('Error creating product:', error);
    return null;
  }
  
  return data;
}

export async function updateProduct(id: string, updates: any) {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating product:', error);
    return null;
  }
  
  return data;
}

export async function deleteProduct(id: string) {
  const supabase = createServiceClient();
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting product:', error);
    return false;
  }
  
  return true;
}

// ==================
// ORDER UTILITIES
// ==================

export async function createOrder(userId: string, orderData: any) {
  const supabase = createServiceClient();
  
  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      total: orderData.total,
      status: 'pending',
      shipping_address: orderData.shippingAddress,
      billing_address: orderData.billingAddress,
      payment_method: orderData.paymentMethod,
    })
    .select()
    .single();
    
  if (orderError || !order) {
    console.error('Error creating order:', orderError);
    return null;
  }
  
  // Create order items
  const items = orderData.items.map((item: any) => ({
    order_id: order.id,
    product_id: item.productId,
    quantity: item.quantity,
    price: item.price,
    product_name: item.name,
    product_image: item.image,
  }));
  
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(items);
    
  if (itemsError) {
    console.error('Error creating order items:', itemsError);
    return null;
  }
  
  return order;
}

export async function getUserOrders(userId: string) {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
  
  return data || [];
}

export async function getAllOrders() {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*),
      users (email)
    `)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching all orders:', error);
    return [];
  }
  
  return data || [];
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating order status:', error);
    return null;
  }
  
  return data;
}

// ==================
// CART UTILITIES
// ==================

export async function getUserCart(userId: string) {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase
    .from('carts')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  if (error) {
    // Cart doesn't exist yet
    return { items: [] };
  }
  
  return data || { items: [] };
}

export async function updateUserCart(userId: string, items: any[]) {
  const supabase = createServiceClient();
  
  // Check if cart exists
  const { data: existing } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .single();
    
  if (existing) {
    // Update existing cart
    const { data, error } = await supabase
      .from('carts')
      .update({ items })
      .eq('user_id', userId)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating cart:', error);
      return null;
    }
    
    return data;
  } else {
    // Create new cart
    const { data, error } = await supabase
      .from('carts')
      .insert({
        user_id: userId,
        items,
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating cart:', error);
      return null;
    }
    
    return data;
  }
}

// ==================
// EVENT UTILITIES
// ==================

export async function getAllEvents() {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('active', true)
    .order('event_date', { ascending: true });
    
  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }
  
  return data || [];
}

export async function registerForEvent(userId: string, eventId: string, participants: number = 1) {
  const supabase = createServiceClient();
  
  // Check if already registered
  const { data: existing } = await supabase
    .from('event_registrations')
    .select('id')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .single();
    
  if (existing) {
    return { error: 'Already registered for this event' };
  }
  
  // Register
  const { data, error } = await supabase
    .from('event_registrations')
    .insert({
      event_id: eventId,
      user_id: userId,
      participants,
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error registering for event:', error);
    return { error: error.message };
  }
  
  // Update event enrolled count
  await supabase.rpc('increment_event_enrolled', { event_id: eventId, count: participants });
  
  return { data };
}

export async function getUserEventRegistrations(userId: string) {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase
    .from('event_registrations')
    .select(`
      *,
      events (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching registrations:', error);
    return [];
  }
  
  return data || [];
}

// ==================
// REVIEW UTILITIES
// ==================

export async function getProductReviews(productId: string) {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      users (email)
    `)
    .eq('product_id', productId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
  
  return data || [];
}

export async function createReview(userId: string, productId: string, reviewData: any) {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      user_id: userId,
      product_id: productId,
      rating: reviewData.rating,
      title: reviewData.title,
      comment: reviewData.comment,
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error creating review:', error);
    return null;
  }
  
  return data;
}

// ==================
// SUBSCRIPTION UTILITIES
// ==================

export async function getUserSubscriptions(userId: string) {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching subscriptions:', error);
    return [];
  }
  
  return data || [];
}

export async function createSubscription(userId: string, subscriptionData: any) {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      plan_id: subscriptionData.planId,
      plan_name: subscriptionData.planName,
      frequency: subscriptionData.frequency,
      quantity: subscriptionData.quantity,
      price: subscriptionData.price,
      next_delivery: subscriptionData.nextDelivery,
      status: 'active',
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error creating subscription:', error);
    return null;
  }
  
  return data;
}

// ==================
// BLOG UTILITIES
// ==================

export async function getPublishedBlogPosts() {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
  
  return data || [];
}

// ==================
// OFFER UTILITIES
// ==================

export async function getActiveOffers() {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase
    .from('offers')
    .select(`
      *,
      products (*)
    `)
    .eq('active', true);
    
  if (error) {
    console.error('Error fetching offers:', error);
    return [];
  }
  
  return data || [];
}

export async function getActivePromotions() {
  const supabase = createServiceClient();
  
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('active', true)
    .lte('start_date', now)
    .gte('end_date', now);
    
  if (error) {
    console.error('Error fetching promotions:', error);
    return [];
  }
  
  return data || [];
}