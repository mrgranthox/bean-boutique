import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as db from "./db.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
}));

// Middleware to verify user authentication
async function requireAuth(c: any, next: any) {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return c.json({ error: 'Unauthorized - No token provided' }, 401);
  }

  try {
    const user = await db.getUserFromToken(accessToken);
    if (!user) {
      return c.json({ error: 'Unauthorized - Invalid token' }, 401);
    }
    
    c.set('userId', user.id);
    c.set('userEmail', user.email);
    c.set('accessToken', accessToken);
    await next();
  } catch (error) {
    console.error('Authorization error:', error);
    return c.json({ error: 'Unauthorized - Token validation failed' }, 401);
  }
}

// Middleware to verify admin access
async function requireAdmin(c: any, next: any) {
  const userId = c.get('userId');
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const isAdmin = await db.isAdmin(userId);
  if (!isAdmin) {
    return c.json({ error: 'Forbidden - Admin access required' }, 403);
  }

  await next();
}

// ===================
// HEALTH CHECK
// ===================

app.get("/make-server-4d0792a7/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ===================
// AUTHENTICATION
// ===================

app.post("/make-server-4d0792a7/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    const supabase = db.createServiceClient();

    // Create auth user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true // Auto-confirm since no email server configured
    });

    if (error) {
      console.error('Signup error:', error);
      
      // Handle specific error cases with user-friendly messages
      if (error.message.includes('already been registered') || error.code === 'email_exists') {
        return c.json({ 
          error: 'An account with this email already exists. Please sign in instead or use a different email address.' 
        }, 409); // 409 Conflict
      }
      
      if (error.message.includes('password')) {
        return c.json({ 
          error: 'Password does not meet requirements. Please use a stronger password (minimum 6 characters).' 
        }, 400);
      }
      
      if (error.message.includes('email') || error.message.includes('invalid')) {
        return c.json({ 
          error: 'Invalid email address. Please check and try again.' 
        }, 400);
      }
      
      // Generic error fallback
      return c.json({ 
        error: `Signup failed: ${error.message}` 
      }, 400);
    }

    // Create user record in database
    try {
      await db.createUserRecord(data.user.id, email, 'user');
    } catch (dbError) {
      console.warn('User record creation failed (may already exist):', dbError);
      // Continue - record might already exist from a previous attempt
    }
    
    // Create user profile
    try {
      await db.createUserProfile(data.user.id, name);
    } catch (dbError) {
      console.warn('User profile creation failed (may already exist):', dbError);
      // Continue - profile might already exist from a previous attempt
    }

    return c.json({ 
      message: 'User created successfully', 
      user: { 
        id: data.user.id, 
        email: data.user.email, 
        name 
      } 
    });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// ===================
// USER PROFILE
// ===================

app.get("/make-server-4d0792a7/profile", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const supabase = db.createServiceClient();

    const { data: profile, error } = await supabase
      .from('profiles')
      .select(`
        *,
        users (email, role)
      `)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Profile fetch error:', error);
      return c.json({ error: 'Failed to fetch profile' }, 500);
    }

    // If profile doesn't exist, create it
    if (!profile) {
      const user = await db.getUserFromToken(c.get('accessToken'));
      await db.createUserRecord(userId, user.email || '', 'user');
      await db.createUserProfile(userId, user.user_metadata?.name);
      
      const { data: newProfile } = await supabase
        .from('profiles')
        .select(`
          *,
          users (email, role)
        `)
        .eq('user_id', userId)
        .single();
        
      return c.json({ profile: newProfile });
    }

    return c.json({ profile });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

app.put("/make-server-4d0792a7/profile", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const updates = await c.req.json();
    
    const supabase = db.createServiceClient();

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Profile update error:', error);
      return c.json({ error: 'Failed to update profile' }, 500);
    }

    return c.json({ profile: data });
  } catch (error) {
    console.error('Profile update error:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// ===================
// PRODUCTS
// ===================

app.get("/make-server-4d0792a7/products", async (c) => {
  try {
    const category = c.req.query('category');
    const featured = c.req.query('featured');
    
    const products = await db.getAllProducts(
      category,
      featured ? featured === 'true' : undefined
    );

    return c.json({ products });
  } catch (error) {
    console.error('Products fetch error:', error);
    return c.json({ error: 'Failed to fetch products' }, 500);
  }
});

app.get("/make-server-4d0792a7/products/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const product = await db.getProductById(id);
    
    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }

    return c.json({ product });
  } catch (error) {
    console.error('Product fetch error:', error);
    return c.json({ error: 'Failed to fetch product' }, 500);
  }
});

app.post("/make-server-4d0792a7/products", requireAuth, requireAdmin, async (c) => {
  try {
    const productData = await c.req.json();
    const product = await db.createProduct(productData);
    
    if (!product) {
      return c.json({ error: 'Failed to create product' }, 500);
    }

    return c.json({ product });
  } catch (error) {
    console.error('Product creation error:', error);
    return c.json({ error: 'Failed to create product' }, 500);
  }
});

app.put("/make-server-4d0792a7/products/:id", requireAuth, requireAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    
    const product = await db.updateProduct(id, updates);
    
    if (!product) {
      return c.json({ error: 'Failed to update product' }, 500);
    }

    return c.json({ product });
  } catch (error) {
    console.error('Product update error:', error);
    return c.json({ error: 'Failed to update product' }, 500);
  }
});

app.delete("/make-server-4d0792a7/products/:id", requireAuth, requireAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    const success = await db.deleteProduct(id);
    
    if (!success) {
      return c.json({ error: 'Failed to delete product' }, 500);
    }

    return c.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Product deletion error:', error);
    return c.json({ error: 'Failed to delete product' }, 500);
  }
});

// ===================
// SHOPPING CART
// ===================

app.get("/make-server-4d0792a7/cart", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const cart = await db.getUserCart(userId);

    return c.json({ cart });
  } catch (error) {
    console.error('Cart fetch error:', error);
    return c.json({ error: 'Failed to fetch cart' }, 500);
  }
});

app.post("/make-server-4d0792a7/cart", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const { items } = await c.req.json();
    
    const cart = await db.updateUserCart(userId, items);
    
    if (!cart) {
      return c.json({ error: 'Failed to update cart' }, 500);
    }

    return c.json({ cart });
  } catch (error) {
    console.error('Cart update error:', error);
    return c.json({ error: 'Failed to update cart' }, 500);
  }
});

// ===================
// ORDERS
// ===================

app.post("/make-server-4d0792a7/orders", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const orderData = await c.req.json();
    
    const order = await db.createOrder(userId, orderData);
    
    if (!order) {
      return c.json({ error: 'Failed to create order' }, 500);
    }

    // Clear cart after successful order
    await db.updateUserCart(userId, []);

    return c.json({ order });
  } catch (error) {
    console.error('Order creation error:', error);
    return c.json({ error: 'Failed to create order' }, 500);
  }
});

app.get("/make-server-4d0792a7/orders", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const orders = await db.getUserOrders(userId);

    return c.json({ orders });
  } catch (error) {
    console.error('Orders fetch error:', error);
    return c.json({ error: 'Failed to fetch orders' }, 500);
  }
});

app.get("/make-server-4d0792a7/orders/:id", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const orderId = c.req.param('id');
    
    const supabase = db.createServiceClient();
    
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', orderId)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Order fetch error:', error);
      return c.json({ error: 'Order not found' }, 404);
    }

    return c.json({ order });
  } catch (error) {
    console.error('Order fetch error:', error);
    return c.json({ error: 'Failed to fetch order' }, 500);
  }
});

// Admin: Get all orders
app.get("/make-server-4d0792a7/admin/orders", requireAuth, requireAdmin, async (c) => {
  try {
    const orders = await db.getAllOrders();
    return c.json({ orders });
  } catch (error) {
    console.error('Admin orders fetch error:', error);
    return c.json({ error: 'Failed to fetch orders' }, 500);
  }
});

// Admin: Update order status
app.put("/make-server-4d0792a7/admin/orders/:id/status", requireAuth, requireAdmin, async (c) => {
  try {
    const orderId = c.req.param('id');
    const { status } = await c.req.json();
    
    const order = await db.updateOrderStatus(orderId, status);
    
    if (!order) {
      return c.json({ error: 'Failed to update order status' }, 500);
    }

    return c.json({ order });
  } catch (error) {
    console.error('Order status update error:', error);
    return c.json({ error: 'Failed to update order status' }, 500);
  }
});

// ===================
// EVENTS
// ===================

app.get("/make-server-4d0792a7/events", async (c) => {
  try {
    const events = await db.getAllEvents();
    return c.json({ events });
  } catch (error) {
    console.error('Events fetch error:', error);
    return c.json({ error: 'Failed to fetch events' }, 500);
  }
});

app.get("/make-server-4d0792a7/events/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const supabase = db.createServiceClient();
    
    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Event fetch error:', error);
      return c.json({ error: 'Event not found' }, 404);
    }

    return c.json({ event });
  } catch (error) {
    console.error('Event fetch error:', error);
    return c.json({ error: 'Failed to fetch event' }, 500);
  }
});

app.post("/make-server-4d0792a7/events/:id/register", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const eventId = c.req.param('id');
    const { participants = 1 } = await c.req.json();
    
    const result = await db.registerForEvent(userId, eventId, participants);
    
    if (result.error) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({ registration: result.data });
  } catch (error) {
    console.error('Event registration error:', error);
    return c.json({ error: 'Failed to register for event' }, 500);
  }
});

app.get("/make-server-4d0792a7/registrations", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const registrations = await db.getUserEventRegistrations(userId);

    return c.json({ registrations });
  } catch (error) {
    console.error('Registrations fetch error:', error);
    return c.json({ error: 'Failed to fetch registrations' }, 500);
  }
});

// Admin: Create event
app.post("/make-server-4d0792a7/admin/events", requireAuth, requireAdmin, async (c) => {
  try {
    const eventData = await c.req.json();
    const supabase = db.createServiceClient();
    
    const { data: event, error } = await supabase
      .from('events')
      .insert(eventData)
      .select()
      .single();

    if (error) {
      console.error('Event creation error:', error);
      return c.json({ error: 'Failed to create event' }, 500);
    }

    return c.json({ event });
  } catch (error) {
    console.error('Event creation error:', error);
    return c.json({ error: 'Failed to create event' }, 500);
  }
});

// Admin: Update event
app.put("/make-server-4d0792a7/admin/events/:id", requireAuth, requireAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const supabase = db.createServiceClient();
    
    const { data: event, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Event update error:', error);
      return c.json({ error: 'Failed to update event' }, 500);
    }

    return c.json({ event });
  } catch (error) {
    console.error('Event update error:', error);
    return c.json({ error: 'Failed to update event' }, 500);
  }
});

// Admin: Delete event
app.delete("/make-server-4d0792a7/admin/events/:id", requireAuth, requireAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    const supabase = db.createServiceClient();
    
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Event deletion error:', error);
      return c.json({ error: 'Failed to delete event' }, 500);
    }

    return c.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Event deletion error:', error);
    return c.json({ error: 'Failed to delete event' }, 500);
  }
});

// ===================
// REVIEWS
// ===================

app.get("/make-server-4d0792a7/reviews/product/:productId", async (c) => {
  try {
    const productId = c.req.param('productId');
    const reviews = await db.getProductReviews(productId);

    return c.json({ reviews });
  } catch (error) {
    console.error('Reviews fetch error:', error);
    return c.json({ error: 'Failed to fetch reviews' }, 500);
  }
});

app.post("/make-server-4d0792a7/reviews", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const { productId, rating, title, comment } = await c.req.json();
    
    const review = await db.createReview(userId, productId, { rating, title, comment });
    
    if (!review) {
      return c.json({ error: 'Failed to create review' }, 500);
    }

    return c.json({ review });
  } catch (error) {
    console.error('Review creation error:', error);
    return c.json({ error: 'Failed to create review' }, 500);
  }
});

// ===================
// SUBSCRIPTIONS
// ===================

app.get("/make-server-4d0792a7/subscriptions", async (c) => {
  try {
    // Return available subscription plans (hardcoded for now)
    const plans = [
      {
        id: 'weekly',
        name: 'Weekly Coffee Box',
        description: 'Fresh coffee delivered every week',
        frequency: 'weekly',
        price: 24.99,
      },
      {
        id: 'monthly',
        name: 'Monthly Coffee Club',
        description: 'Curated coffee selection each month',
        frequency: 'monthly',
        price: 89.99,
      },
      {
        id: 'quarterly',
        name: 'Quarterly Discovery',
        description: 'Seasonal coffee exploration every 3 months',
        frequency: 'quarterly',
        price: 249.99,
      },
    ];

    return c.json({ plans });
  } catch (error) {
    console.error('Subscription plans fetch error:', error);
    return c.json({ error: 'Failed to fetch subscription plans' }, 500);
  }
});

app.get("/make-server-4d0792a7/subscriptions/active", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const subscriptions = await db.getUserSubscriptions(userId);

    return c.json({ subscriptions });
  } catch (error) {
    console.error('Active subscriptions fetch error:', error);
    return c.json({ error: 'Failed to fetch subscriptions' }, 500);
  }
});

app.post("/make-server-4d0792a7/subscriptions/subscribe", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const subscriptionData = await c.req.json();
    
    const subscription = await db.createSubscription(userId, subscriptionData);
    
    if (!subscription) {
      return c.json({ error: 'Failed to create subscription' }, 500);
    }

    return c.json({ subscription });
  } catch (error) {
    console.error('Subscription creation error:', error);
    return c.json({ error: 'Failed to create subscription' }, 500);
  }
});

app.put("/make-server-4d0792a7/subscriptions/:id", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const id = c.req.param('id');
    const updates = await c.req.json();
    
    const supabase = db.createServiceClient();
    
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Subscription update error:', error);
      return c.json({ error: 'Failed to update subscription' }, 500);
    }

    return c.json({ subscription });
  } catch (error) {
    console.error('Subscription update error:', error);
    return c.json({ error: 'Failed to update subscription' }, 500);
  }
});

app.delete("/make-server-4d0792a7/subscriptions/:id/cancel", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const id = c.req.param('id');
    
    const supabase = db.createServiceClient();
    
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .update({ status: 'cancelled', end_date: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Subscription cancellation error:', error);
      return c.json({ error: 'Failed to cancel subscription' }, 500);
    }

    return c.json({ subscription });
  } catch (error) {
    console.error('Subscription cancellation error:', error);
    return c.json({ error: 'Failed to cancel subscription' }, 500);
  }
});

// ===================
// BLOG POSTS
// ===================

app.get("/make-server-4d0792a7/blog", async (c) => {
  try {
    const posts = await db.getPublishedBlogPosts();
    return c.json({ posts });
  } catch (error) {
    console.error('Blog posts fetch error:', error);
    return c.json({ error: 'Failed to fetch blog posts' }, 500);
  }
});

// ===================
// OFFERS & PROMOTIONS
// ===================

app.get("/make-server-4d0792a7/offers", async (c) => {
  try {
    const offers = await db.getActiveOffers();
    return c.json({ offers });
  } catch (error) {
    console.error('Offers fetch error:', error);
    return c.json({ error: 'Failed to fetch offers' }, 500);
  }
});

app.get("/make-server-4d0792a7/promotions", async (c) => {
  try {
    const promotions = await db.getActivePromotions();
    return c.json({ promotions });
  } catch (error) {
    console.error('Promotions fetch error:', error);
    return c.json({ error: 'Failed to fetch promotions' }, 500);
  }
});

// ===================
// ADMIN - ANALYTICS
// ===================

app.get("/make-server-4d0792a7/admin/analytics", requireAuth, requireAdmin, async (c) => {
  try {
    const supabase = db.createServiceClient();

    // Get total revenue
    const { data: orders } = await supabase
      .from('orders')
      .select('total, status');
    
    const totalRevenue = orders
      ?.filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + parseFloat(o.total || 0), 0) || 0;

    // Get order counts
    const totalOrders = orders?.length || 0;
    const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;

    // Get user count
    const { data: users } = await supabase
      .from('users')
      .select('id');
    const totalCustomers = users?.length || 0;

    // Get popular products
    const { data: orderItems } = await supabase
      .from('order_items')
      .select('product_id, product_name, quantity, price');
    
    const productSales: Record<string, any> = {};
    orderItems?.forEach(item => {
      if (!productSales[item.product_id]) {
        productSales[item.product_id] = {
          name: item.product_name,
          totalSold: 0,
          revenue: 0,
        };
      }
      productSales[item.product_id].totalSold += item.quantity;
      productSales[item.product_id].revenue += item.quantity * parseFloat(item.price);
    });

    const popularProducts = Object.values(productSales)
      .sort((a: any, b: any) => b.totalSold - a.totalSold)
      .slice(0, 5);

    return c.json({
      totalRevenue,
      totalOrders,
      pendingOrders,
      totalCustomers,
      popularProducts,
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return c.json({ error: 'Failed to fetch analytics' }, 500);
  }
});

// ===================
// ADMIN - USERS
// ===================

app.get("/make-server-4d0792a7/admin/users", requireAuth, requireAdmin, async (c) => {
  try {
    const supabase = db.createServiceClient();

    const { data: users, error } = await supabase
      .from('users')
      .select(`
        *,
        profiles (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Users fetch error:', error);
      return c.json({ error: 'Failed to fetch users' }, 500);
    }

    return c.json({ users });
  } catch (error) {
    console.error('Users fetch error:', error);
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

app.put("/make-server-4d0792a7/admin/users/:id", requireAuth, requireAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    
    const supabase = db.createServiceClient();
    
    const { data: user, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('User update error:', error);
      return c.json({ error: 'Failed to update user' }, 500);
    }

    return c.json({ user });
  } catch (error) {
    console.error('User update error:', error);
    return c.json({ error: 'Failed to update user' }, 500);
  }
});

// Start the server
Deno.serve(app.fetch);