import { productsApi, adminApi } from "./api";
import { env } from "./env";

interface DataManagerOptions {
  useBackend?: boolean;
  fallbackToLocal?: boolean;
  timeout?: number;
  cacheEnabled?: boolean;
  cacheDuration?: number;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  source: "backend" | "local";
}

// High-fidelity fallback catalog to enable graceful offline/recovery operations (Layer 13)
const LOCAL_FALLBACK_PRODUCTS = [
  {
    id: "fallback-1",
    name: "Ethiopian Yirgacheffe (Offline Fallback)",
    price: 24.99,
    image_url: "https://images.unsplash.com/photo-1652248920808-2246c8011c2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "Bright and floral single-origin coffee with exceptional complexity and citrus-floral notes.",
    category: "coffee",
    origin: "Ethiopia",
    roast_level: "Light",
    flavor_notes: ["Citrus", "Floral", "Tea-like", "Bergamot"],
    processing_method: "Washed",
    altitude: "1,700-2,200m",
    rating: 4.8,
    review_count: 247,
    stock: 50,
    featured: true,
    new: true,
    bestseller: true
  },
  {
    id: "fallback-2",
    name: "Colombian Supremo (Offline Fallback)",
    price: 22.99,
    image_url: "https://images.unsplash.com/photo-1652248920808-2246c8011c2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "Rich and chocolatey medium roast with beautifully balanced caramel and orange acidity.",
    category: "coffee",
    origin: "Colombia",
    roast_level: "Medium",
    flavor_notes: ["Chocolate", "Caramel", "Nuts", "Orange"],
    processing_method: "Washed",
    altitude: "1,200-1,800m",
    rating: 4.7,
    review_count: 189,
    stock: 45,
    featured: true,
    new: false,
    bestseller: true
  },
  {
    id: "fallback-3",
    name: "Precision Burr Grinder (Offline Fallback)",
    price: 349.99,
    image_url: "https://images.unsplash.com/photo-1573066380308-24ff4c273dbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "Professional-grade ceramic burr grinder with 18 settings for ultra-consistent optimal extraction.",
    category: "equipment",
    brand: "Bean Boutique Pro",
    rating: 4.8,
    review_count: 324,
    stock: 12,
    featured: true,
    new: true,
    bestseller: true
  },
  {
    id: "fallback-4",
    name: "Pour Over Dripper Set (Offline Fallback)",
    price: 79.99,
    image_url: "https://images.unsplash.com/photo-1621744895572-da8dde3c425a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "Elegant ceramic dripper combined with borosilicate glass carafe. Excellent manual coffee control.",
    category: "equipment",
    brand: "Hario",
    rating: 4.7,
    review_count: 256,
    stock: 20,
    featured: true,
    new: false,
    bestseller: false
  }
];

class DataManager {
  private backendAvailable: boolean | null = null;
  private initializationAttempted = false;
  private options: DataManagerOptions;
  private cache: Map<string, CacheEntry<any>> = new Map();
  private lastHealthCheck: number = 0;
  private healthCheckInterval: number = 30000; // 30 seconds

  constructor(options: DataManagerOptions = {}) {
    this.options = {
      useBackend: true,
      fallbackToLocal: true, // Enable smart robust offline fallback (Layer 13)
      timeout: env.apiTimeout || 5000,
      cacheEnabled: env.features.enableAdvancedCaching !== false,
      cacheDuration: 300000, // 5 minutes default
      ...options,
    };
  }

  /**
   * Get data from cache if valid
   */
  private getCached<T>(key: string): T | null {
    if (!this.options.cacheEnabled) return null;

    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    const age = now - entry.timestamp;

    if (age > (this.options.cacheDuration || 300000)) {
      this.cache.delete(key);
      return null;
    }

    // console.log(
    //   `📦 Cache HIT for ${key} (age: ${Math.round(age / 1000)}s, source: ${
    //     entry.source
    //   })`
    // );
    return entry.data as T;
  }

  /**
   * Store data in cache
   */
  private setCache<T>(key: string, data: T, source: "backend" | "local"): void {
    if (!this.options.cacheEnabled) return;

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      source,
    });
    //console.log(`💾 Cached ${key} from ${source}`);
  }

  /**
   * Clear all cache entries
   */
  public clearCache(): void {
    this.cache.clear();
    //console.log("🗑️ Cache cleared");
  }

  /**
   * Clear specific cache entry
   */
  public clearCacheEntry(key: string): void {
    this.cache.delete(key);
    //console.log(`🗑️ Cache entry cleared: ${key}`);
  }

  async checkBackendHealth(force: boolean = false): Promise<boolean> {
    if (!this.options.useBackend) {
      return false;
    }

    // Use cached health check if recent (unless forced)
    const now = Date.now();
    if (
      !force &&
      this.backendAvailable !== null &&
      now - this.lastHealthCheck < this.healthCheckInterval
    ) {
      return this.backendAvailable;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        this.options.timeout
      );

      const response = await fetch(`${env.supabase.apiUrl}/health`, {
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${env.supabase.anonKey}`,
        },
      });

      clearTimeout(timeoutId);
      this.lastHealthCheck = now;

      if (response.ok) {
        //console.log("✅ Backend is healthy and available");
        this.backendAvailable = true;
        return true;
      } else {
        //console.warn("⚠️ Backend responded but not healthy:", response.status);
        this.backendAvailable = false;
        return false;
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        //console.warn("⚠️ Backend health check timed out");
      } else {
        //console.warn("⚠️ Backend health check failed:", error.message);
      }
      this.backendAvailable = false;
      this.lastHealthCheck = now;
      return false;
    }
  }

  async initializeData(): Promise<{
    success: boolean;
    message: string;
    source: "backend" | "local";
  }> {
    if (this.initializationAttempted) {
      return {
        success: true,
        message: "Data already initialized",
        source: this.backendAvailable ? "backend" : "local",
      };
    }

    this.initializationAttempted = true;

    // First check if backend is available
    const backendHealthy = await this.checkBackendHealth();

    if (backendHealthy) {
      try {
        // console.log("🔄 Backend is healthy, verifying data...");

        // Verify backend data exists
        const verification = await this.verifyBackendData();
        if (verification.success) {
          //console.log("✅ Backend data verified");
          return {
            success: true,
            message: "Backend data verified and ready",
            source: "backend",
          };
        } else {
          // console.warn(
          //   "⚠️ Backend is healthy but no data found. Please run migration SQL files."
          // );
          return {
            success: false,
            message:
              "Backend has no data. Please run the migration SQL files to populate the database.",
            source: "backend",
          };
        }
      } catch (error: any) {
        //console.warn("⚠️ Backend verification error:", error.message);
        return {
          success: false,
          message: `Backend verification failed: ${error.message}`,
          source: "backend",
        };
      }
    }

    // Backend unavailable
    return {
      success: false,
      message:
        "Backend is unavailable. Please check your connection and backend configuration.",
      source: "local",
    };
  }

  async verifyBackendData(): Promise<{ success: boolean; count: number }> {
    try {
      const response = await productsApi.getProducts({ limit: 1 });
      const productCount = response?.products?.length || 0;

      // console.log(`Backend verification: ${productCount} products found`);

      return {
        success: productCount > 0,
        count: productCount,
      };
    } catch (error) {
      //console.warn("Backend verification failed:", error.message);
      return { success: false, count: 0 };
    }
  }

  async getProducts(params?: {
    category?: string;
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<{
    products: any[];
    pagination: any;
    source: "backend" | "local";
  }> {
    // Generate cache key
    const cacheKey = `products:${JSON.stringify(params || {})}`;

    // Check cache first
    const cached = this.getCached<{
      products: any[];
      pagination: any;
      source: "backend" | "local";
    }>(cacheKey);
    if (cached) {
      return cached;
    }

    // Try to fetch from backend
    try {
      const response = await productsApi.getProducts(params);

      if (response && response.products) {
        // console.log(`✅ Got ${response.products.length} products from backend`);
        this.backendAvailable = true;
        const result = {
          ...response,
          source: "backend" as const,
        };
        this.setCache(cacheKey, result, "backend");
        return result;
      }
    } catch (error: any) {
      console.warn("⚠️ Backend product fetch failed. Recovering with fallback:", error.message);
      this.backendAvailable = false;

      if (this.options.fallbackToLocal) {
        const filteredProducts = params?.category
          ? LOCAL_FALLBACK_PRODUCTS.filter(p => p.category === params.category)
          : LOCAL_FALLBACK_PRODUCTS;

        const result = {
          products: filteredProducts,
          pagination: {
            page: params?.page || 1,
            limit: params?.limit || 12,
            total: filteredProducts.length,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          },
          source: "local" as const,
        };
        this.setCache(cacheKey, result, "local");
        return result;
      }

      throw new Error(
        `Failed to fetch products from backend: ${error.message}`
      );
    }

    // If we reach here, backend failed and no fallback
    throw new Error(
      "Unable to fetch products. Please check your backend connection."
    );
  }

  async getProduct(
    id: string
  ): Promise<{ product: any | null; source: "backend" | "local" }> {
    // Check cache first
    const cacheKey = `product:${id}`;
    const cached = this.getCached<{
      product: any | null;
      source: "backend" | "local";
    }>(cacheKey);
    if (cached) {
      return cached;
    }

    // Try backend
    try {
      const response = await productsApi.getProduct(id);
      if (response?.product) {
        const result = {
          product: response.product,
          source: "backend" as const,
        };
        this.setCache(cacheKey, result, "backend");
        return result;
      }

      // Product not found
      return { product: null, source: "backend" as const };
    } catch (error: any) {
      console.warn(`⚠️ Backend product fetch for ${id} failed. Recovering with fallback:`, error.message);
      this.backendAvailable = false;

      if (this.options.fallbackToLocal) {
        const localProduct = LOCAL_FALLBACK_PRODUCTS.find(p => p.id === id) || null;
        const result = {
          product: localProduct,
          source: "local" as const,
        };
        this.setCache(cacheKey, result, "local");
        return result;
      }

      throw new Error(`Failed to fetch product: ${error.message}`);
    }
  }

  isBackendAvailable(): boolean {
    return this.backendAvailable === true;
  }

  getStatus(): {
    backend: boolean | null;
    initialized: boolean;
    fallbackEnabled: boolean;
  } {
    return {
      backend: this.backendAvailable,
      initialized: this.initializationAttempted,
      fallbackEnabled: this.options.fallbackToLocal || false,
    };
  }
}

// Create a singleton instance with default fallback enabled (Layer 13)
export const dataManager = new DataManager({
  useBackend: true,
  fallbackToLocal: true, // Auto-recovery fallback enabled
  timeout: 8000, // 8 second timeout
});

// Legacy exports for backward compatibility
export async function checkAndInitializeData() {
  const result = await dataManager.initializeData();
  return {
    success: result.success,
    message: result.message,
    error: result.success ? null : result.message,
  };
}

(dataManager as any).initializeData = dataManager.initializeData.bind(dataManager);
