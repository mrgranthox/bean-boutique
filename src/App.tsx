import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import { Navigation } from "./components/Navigation";
import { HomePage } from "./components/pages/HomePage";
import { CoffeeSelectionPage } from "./components/pages/CoffeeSelectionPage";
import { BrewingEquipmentPage } from "./components/pages/BrewingEquipmentPage";
import { EventsPage } from "./components/pages/EventsPage";
import { ShoppingCartPage } from "./components/pages/ShoppingCartPage";
import { OffersPage } from "./components/pages/OffersPage";
import { SubscriptionPage } from "./components/pages/SubscriptionPage";
import { CheckoutPage } from "./components/pages/CheckoutPage";
import { AboutPage } from "./components/pages/AboutPage";
import { BlogPage } from "./components/pages/BlogPage";
import { FAQPage } from "./components/pages/FAQPage";
import { ContactPage } from "./components/pages/ContactPage";
import { PrivacyPolicyPage } from "./components/pages/PrivacyPolicyPage";
import { TermsOfServicePage } from "./components/pages/TermsOfServicePage";
import { ProductDetailsPage } from "./components/pages/ProductDetailsPage";
import { UserProfilePage } from "./components/pages/UserProfilePage";
import { AdminDashboardPage } from "./components/pages/AdminDashboardPage";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { auth } from "./utils/supabase/client";
import { dataManager } from "./utils/data-manager";
import { DataSourceIndicator } from "./components/DataSourceIndicator";
import { OAuthTroubleshooter } from "./components/OAuthTroubleshooter";
import { OAuthDebugger } from "./components/OAuthDebugger";
import { OAuthSetupWizard } from "./components/OAuthSetupWizard";
import { useLocalCart } from "./hooks/useLocalCart";
import { handleOAuthCallback } from "./utils/oauth-handler";
import { env } from "./utils/env";

export type Page =
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

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

interface CartContextType {
  cart: any;
  cartItemCount: number;
  addToCart: (productId: string, quantity?: number) => Promise<boolean>;
  updateQuantity: (productId: string, quantity: number) => Promise<boolean>;
  removeFromCart: (productId: string) => Promise<boolean>;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [productDetails, setProductDetails] = useState<{
    id: string;
    category: "coffee" | "equipment";
  } | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataInitialized, setDataInitialized] = useState(false);

  // Use local cart hook (localStorage-based, no database)
  const cartHook = useLocalCart(authLoading ? null : user);
  const isAppReady = !authLoading && cartHook !== undefined;

  // Initialize auth and data on app start
  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        // First, handle any OAuth callback
        const oauthResult = await handleOAuthCallback();
        if (oauthResult.success && oauthResult.user) {
          console.log(`OAuth callback successful for ${oauthResult.provider}`);
          toast.success(
            `Welcome! You are now signed in with ${
              oauthResult.provider || "OAuth"
            }.`
          );
          if (mounted) {
            setUser(oauthResult.user);
            setAuthLoading(false);
          }
          return; // Early return, OAuth handled the authentication
        } else if (
          oauthResult.error &&
          oauthResult.error !== "No OAuth parameters found"
        ) {
          console.error("OAuth callback error:", oauthResult.error);
          toast.error(oauthResult.error);
        }

        // Check regular authentication state
        const { session } = await auth.getSession();
        if (mounted) {
          setUser(session?.user || null);
          setAuthLoading(false);

          // If user just signed in via OAuth, create profile if needed
          if (session?.user && !authLoading) {
            try {
              // Try to create user profile for OAuth users
              const response = await fetch(`${env.supabase.apiUrl}/profile`, {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${session.access_token}`,
                },
              });

              if (response.ok) {
                // console.log("User profile verified/created for OAuth user");
              }
            } catch (error) {
              console.log(
                "Note: Could not verify profile for OAuth user:",
                error
              );
            }
          }
        }

        // Set up auth state listener
        const {
          data: { subscription },
        } = auth.onAuthStateChange(async (event, session) => {
          if (mounted) {
            setUser(session?.user || null);
            setAuthLoading(false);

            // Handle OAuth sign-in success
            if (event === "SIGNED_IN" && session?.user) {
              // console.log("User signed in:", session.user.email);
              // toast.success(
              //   `Welcome ${session.user.email}! You are now signed in.`
              // );

              // Try to create user profile for OAuth users
              try {
                const response = await fetch(`${env.supabase.apiUrl}/profile`, {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${session.access_token}`,
                  },
                });

                if (response.ok) {
                  // console.log("User profile created/verified for OAuth user");
                }
              } catch (error) {
                console.log(
                  "Note: Could not create profile for OAuth user:",
                  error
                );
              }
            }
          }
        });

        // Initialize app data
        if (!dataInitialized) {
          try {
            const result = await dataManager.initializeData();
            if (mounted) {
              setDataInitialized(true);
              console.log(
                `✅ App data ready: ${result.message} (source: ${result.source})`
              );

              // Log data manager status
              const status = dataManager.getStatus();
              console.log("📊 Data Manager Status:", status);
            }
          } catch (error) {
            console.warn(
              "⚠️ Data initialization failed, app will use fallback data:",
              error
            );
            if (mounted) {
              setDataInitialized(true);
            }
          }
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("App initialization error:", error);
        if (mounted) {
          setAuthLoading(false);
          setDataInitialized(true); // Continue even if data init fails
        }
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, [dataInitialized]);

  // Auth helpers
  const handleSignOut = useCallback(async () => {
    try {
      await auth.signOut();
      setUser(null);
      cartHook.clearCart(); // Clear cart on sign out
      toast.success("You have been signed out successfully");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
  }, [cartHook]);

  // Handle page changes with product details
  const handlePageChange = useCallback(
    (page: Page, productId?: string, category?: "coffee" | "equipment") => {
      if (page === "product-details" && productId && category) {
        setProductDetails({ id: productId, category });
      } else {
        setProductDetails(null);
      }
      setCurrentPage(page);
    },
    []
  );

  // Scroll to top when page changes
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    // Small delay to ensure page transition
    const timeoutId = setTimeout(scrollToTop, 50);
    return () => clearTimeout(timeoutId);
  }, [currentPage]);

  // Scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.1 }
    );

    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onPageChange={handlePageChange} />;
      case "coffee":
        return <CoffeeSelectionPage onPageChange={handlePageChange} />;
      case "equipment":
        return <BrewingEquipmentPage onPageChange={handlePageChange} />;
      case "events":
        return <EventsPage onPageChange={handlePageChange} />;
      case "cart":
        return <ShoppingCartPage onPageChange={handlePageChange} />;
      case "offers":
        return <OffersPage onPageChange={handlePageChange} />;
      case "subscription":
        return <SubscriptionPage onPageChange={handlePageChange} />;
      case "checkout":
        return <CheckoutPage onPageChange={handlePageChange} />;
      case "about":
        return <AboutPage />;
      case "blog":
        return <BlogPage onPageChange={handlePageChange} />;
      case "faq":
        return <FAQPage onPageChange={handlePageChange} />;
      case "contact":
        return <ContactPage />;
      case "privacy":
        return <PrivacyPolicyPage />;
      case "terms":
        return <TermsOfServicePage />;
      case "product-details":
        return (
          <ProductDetailsPage
            onPageChange={handlePageChange}
            productId={productDetails?.id}
            category={productDetails?.category}
          />
        );
      case "profile":
        return <UserProfilePage onPageChange={handlePageChange} />;
      case "admin":
        return <AdminDashboardPage onPageChange={handlePageChange} />;
      default:
        return <HomePage onPageChange={handlePageChange} />;
    }
  };

  const authContextValue: AuthContextType = {
    user,
    loading: authLoading,
    signOut: handleSignOut,
  };

  const cartContextValue: CartContextType = {
    cart: cartHook.cart,
    cartItemCount: cartHook.cartItemCount,
    addToCart: cartHook.addToCart,
    updateQuantity: cartHook.updateQuantity,
    removeFromCart: cartHook.removeItem,
    clearCart: cartHook.clearCart,
    refreshCart: cartHook.refreshCart,
    loading: cartHook.loading,
    error: cartHook.error,
  };

  console.log("🔍 App Ready Check:", {
    authLoading,
    cartHook: cartHook ? "exists" : "null",
    cartLoading: cartHook?.loading,
    isReady: !authLoading && cartHook && !cartHook.loading,
  });

  if (authLoading) {
    console.log("⏳ Showing loading screen because auth is loading");
    return console.log("⏳ Showing loading screen because auth is loading");
  }
  // Show loading screen only if auth is still loading (allow app to work without backend)
  if (!isAppReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl mb-2">Bean Boutique</h2>
          <p className="text-muted-foreground">Brewing your experience...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      <CartContext.Provider value={cartContextValue}>
        <div className="min-h-screen bg-background">
          <Navigation
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />

          <main>{renderPage()}</main>

          <Footer onPageChange={handlePageChange} />

          {/* Data Source Indicator */}
          {/* <DataSourceIndicator /> */}

          {/* OAuth Tools - Only show in development */}
          {/* {env.features.enableOAuthDebugTools && (
            <>
              <OAuthSetupWizard />
              <OAuthDebugger />
              <OAuthTroubleshooter />
            </>
          )} */}

          {/* Centered Toast Container */}
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: "#a8b4c7ff",
                color: "#bc6406ff",
                border: "1px solid hsl(var(--border))",
              },
            }}
          />
        </div>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
}
