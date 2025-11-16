import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { AdminProductManagement } from "./admin/AdminProductManagement";
import { AdminOrderManagement } from "./admin/AdminOrderManagement";
import { AdminUserManagement } from "./admin/AdminUserManagement";
import { AdminEventManagement } from "./admin/AdminEventManagement";
import { AdminSubscriptionManagement } from "./admin/AdminSubscriptionManagement";
import { AdminOffersManagement } from "./admin/AdminOffersManagement";
import { AdminAnalytics } from "./admin/AdminAnalytics";
import { AdminSettings } from "./admin/AdminSettings";
import { AdminContentManagement } from "./admin/AdminContentManagement";
import { useAuth } from "../../App";
import {
  BarChart3,
  Package,
  Users,
  Calendar,
  Coffee,
  Gift,
  Settings,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  FileText,
  Database,
  Bug,
} from "lucide-react";
import { toast } from "sonner";
import { AdminAccessDebugger } from "../AdminAccessDebugger";

type Page =
  | "home"
  | "coffee"
  | "equipment"
  | "events"
  | "cart"
  | "offers"
  | "subscription"
  | "checkout"
  | "about"
  | "blog"
  | "faq"
  | "contact"
  | "privacy"
  | "terms"
  | "product-details"
  | "profile"
  | "admin";

interface AdminDashboardPageProps {
  onPageChange: (page: Page) => void;
}

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalProducts: number;
  totalEvents: number;
  activeSubscriptions: number;
  recentOrders: any[];
  topProducts: any[];
  monthlyRevenue: number[];
}

export function AdminDashboardPage({ onPageChange }: AdminDashboardPageProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalEvents: 0,
    activeSubscriptions: 0,
    recentOrders: [],
    topProducts: [],
    monthlyRevenue: [],
  });
  const [loading, setLoading] = useState(true);

  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [showDebugger, setShowDebugger] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        console.log("❌ No user logged in");
        setAccessDenied(true);
        setCheckingAdmin(false);
        return;
      }

      try {
        setCheckingAdmin(true);
        console.log("🔍 Checking admin access for:", user.email);

        const { isUserAdmin } = await import("../../utils/admin-db");
        const adminStatus = await isUserAdmin();

        console.log("Admin check result:", adminStatus);

        if (!adminStatus) {
          console.log("❌ Access denied - user is not admin");
          setAccessDenied(true);
          setIsAdmin(false);
          toast.error(
            "Access denied. Admin privileges required. Check console for details."
          );
          return;
        }

        console.log("✅ Admin access granted");
        setIsAdmin(true);
        setAccessDenied(false);
      } catch (error) {
        console.error("❌ Failed to check admin status:", error);
        setAccessDenied(true);
        toast.error(
          "Failed to verify admin access. Check console for details."
        );
      } finally {
        setCheckingAdmin(false);
      }
    };

    loadDashboardStats();
    checkAdminStatus();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);

      // Load stats from Supabase database
      const { getDashboardStats } = await import("../../utils/admin-db");
      const data = await getDashboardStats();
      setStats(data);

      console.log("✅ Dashboard stats loaded from database:", data);
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
      toast.error(
        "Failed to load dashboard statistics. Please ensure database is set up."
      );

      setStats({
        totalOrders: 0,
        totalRevenue: 0,
        totalUsers: 0,
        totalProducts: 0,
        totalEvents: 0,
        activeSubscriptions: 0,
        recentOrders: [],
        topProducts: [],
        monthlyRevenue: [],
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          {/* <h2 className="text-xl mb-2">Checking Admin Access</h2>
          <p className="text-muted-foreground">Verifying credentials...</p> */}
        </div>
      </div>
    );
  }

  if (accessDenied || !isAdmin) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-center text-red-600">
                Access Denied
              </CardTitle>
              <CardDescription className="text-center">
                You need admin privileges to access this page.
                {user && (
                  <div className="mt-2 text-sm">
                    Current user:{" "}
                    <span className="font-mono">{user.email}</span>
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Button
                  onClick={() => onPageChange("home")}
                  className="flex-1"
                  variant="outline"
                >
                  Return to Home
                </Button>
                <Button
                  onClick={() => setShowDebugger(!showDebugger)}
                  className="flex-1"
                  variant="secondary"
                >
                  <Bug className="w-4 h-4 mr-2" />
                  {showDebugger ? "Hide" : "Show"} Debugger
                </Button>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
                <p className="font-medium mb-2">🔧 To grant admin access:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Open your Supabase project dashboard</li>
                  <li>Go to the SQL Editor</li>
                  <li>
                    Open the{" "}
                    <code className="bg-amber-100 px-1 rounded">
                      SET_ADMIN_USER.sql
                    </code>{" "}
                    file from this project
                  </li>
                  <li>
                    Replace the email with{" "}
                    <code className="bg-amber-100 px-1 rounded">
                      {user?.email || "your email"}
                    </code>
                  </li>
                  <li>Run the SQL script</li>
                  <li>Sign out and sign back in</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {showDebugger && <AdminAccessDebugger />}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl mb-2">Loading Admin Dashboard</h2>
          {/* <p className="text-muted-foreground">Fetching data...</p> */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden admin-container">
      <div className="container mx-auto px-4 py-4 md:py-8 max-w-full">
        <div className="mb-4 md:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl mb-2">Admin Dashboard</h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Manage your Bean Boutique coffee shop
              </p>
            </div>
            <Badge variant="secondary" className="bg-coffee-light text-white">
              Admin Access
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto overflow-y-hidden -mx-4 px-4 scrollbar-hide">
            <TabsList className="inline-flex w-full min-w-max md:grid md:w-full md:grid-cols-9 gap-1">
              <TabsTrigger
                value="overview"
                className="flex items-center gap-1 md:gap-2 text-xs md:text-sm whitespace-nowrap"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger
                value="content"
                className="flex items-center gap-1 md:gap-2 text-xs md:text-sm whitespace-nowrap"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Content</span>
              </TabsTrigger>
              <TabsTrigger
                value="products"
                className="flex items-center gap-1 md:gap-2 text-xs md:text-sm whitespace-nowrap"
              >
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Products</span>
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="flex items-center gap-1 md:gap-2 text-xs md:text-sm whitespace-nowrap"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="flex items-center gap-1 md:gap-2 text-xs md:text-sm whitespace-nowrap"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="flex items-center gap-1 md:gap-2 text-xs md:text-sm whitespace-nowrap"
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Events</span>
              </TabsTrigger>
              <TabsTrigger
                value="subscriptions"
                className="flex items-center gap-1 md:gap-2 text-xs md:text-sm whitespace-nowrap"
              >
                <CreditCard className="w-4 h-4" />
                <span className="hidden sm:inline">Subs</span>
              </TabsTrigger>
              <TabsTrigger
                value="offers"
                className="flex items-center gap-1 md:gap-2 text-xs md:text-sm whitespace-nowrap"
              >
                <Gift className="w-4 h-4" />
                <span className="hidden sm:inline">Offers</span>
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="flex items-center gap-1 md:gap-2 text-xs md:text-sm whitespace-nowrap"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6">
              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setActiveTab("content")}
                >
                  <CardContent className="p-4 text-center">
                    <FileText className="h-8 w-8 text-coffee-dark mx-auto mb-2" />
                    <p className="font-medium">Manage Content</p>
                    <p className="text-xs text-muted-foreground">
                      Website content & pages
                    </p>
                  </CardContent>
                </Card>
                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setActiveTab("products")}
                >
                  <CardContent className="p-4 text-center">
                    <Package className="h-8 w-8 text-coffee-dark mx-auto mb-2" />
                    <p className="font-medium">Products</p>
                    <p className="text-xs text-muted-foreground">
                      Inventory management
                    </p>
                  </CardContent>
                </Card>
                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setActiveTab("orders")}
                >
                  <CardContent className="p-4 text-center">
                    <ShoppingCart className="h-8 w-8 text-coffee-dark mx-auto mb-2" />
                    <p className="font-medium">Orders</p>
                    <p className="text-xs text-muted-foreground">
                      Order management
                    </p>
                  </CardContent>
                </Card>
                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setActiveTab("users")}
                >
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 text-coffee-dark mx-auto mb-2" />
                    <p className="font-medium">Users</p>
                    <p className="text-xs text-muted-foreground">
                      Customer management
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Revenue
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-coffee-dark">
                      ${stats.totalRevenue.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +12.5% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Orders
                    </CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-coffee-dark">
                      {stats.totalOrders}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +8.2% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Users
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-coffee-dark">
                      {stats.totalUsers}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +15.3% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Products
                    </CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-coffee-dark">
                      {stats.totalProducts}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Active products
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Analytics Component */}
              <AdminAnalytics stats={stats} />

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>
                      Latest orders from customers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.recentOrders.map((order, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{order.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.customer}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${order.total}</p>
                            <Badge
                              variant={
                                order.status === "completed"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Products</CardTitle>
                    <CardDescription>
                      Best performing products this month
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.topProducts.map((product, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.sales} sales
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              ${product.revenue.toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Revenue
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <AdminContentManagement />
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <AdminProductManagement />
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <AdminOrderManagement />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <AdminUserManagement />
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <AdminEventManagement />
          </TabsContent>

          <TabsContent value="subscriptions" className="mt-6">
            <AdminSubscriptionManagement />
          </TabsContent>

          <TabsContent value="offers" className="mt-6">
            <AdminOffersManagement />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
