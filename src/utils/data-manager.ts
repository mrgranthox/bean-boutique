import { productsApi, adminApi } from './api';
import { env } from './env';

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
  source: 'backend' | 'local';
}

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
      fallbackToLocal: false, // Disable fallback - show errors instead
      timeout: env.apiTimeout || 5000,
      cacheEnabled: env.features.enableAdvancedCaching !== false,
      cacheDuration: 300000, // 5 minutes default
      ...options
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

    console.log(`📦 Cache HIT for ${key} (age: ${Math.round(age / 1000)}s, source: ${entry.source})`);
    return entry.data as T;
  }

  /**
   * Store data in cache
   */
  private setCache<T>(key: string, data: T, source: 'backend' | 'local'): void {
    if (!this.options.cacheEnabled) return;

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      source
    });
    console.log(`💾 Cached ${key} from ${source}`);
  }

  /**
   * Clear all cache entries
   */
  public clearCache(): void {
    this.cache.clear();
    console.log('🗑️ Cache cleared');
  }

  /**
   * Clear specific cache entry
   */
  public clearCacheEntry(key: string): void {
    this.cache.delete(key);
    console.log(`🗑️ Cache entry cleared: ${key}`);
  }

  async checkBackendHealth(force: boolean = false): Promise<boolean> {
    if (!this.options.useBackend) {
      return false;
    }

    // Use cached health check if recent (unless forced)
    const now = Date.now();
    if (!force && this.backendAvailable !== null && (now - this.lastHealthCheck) < this.healthCheckInterval) {
      return this.backendAvailable;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.options.timeout);

      const response = await fetch(`${env.supabase.apiUrl}/health`, {
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${env.supabase.anonKey}`
        }
      });

      clearTimeout(timeoutId);
      this.lastHealthCheck = now;
      
      if (response.ok) {
        console.log('✅ Backend is healthy and available');
        this.backendAvailable = true;
        return true;
      } else {
        console.warn('⚠️ Backend responded but not healthy:', response.status);
        this.backendAvailable = false;
        return false;
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('⚠️ Backend health check timed out');
      } else {
        console.warn('⚠️ Backend health check failed:', error.message);
      }
      this.backendAvailable = false;
      this.lastHealthCheck = now;
      return false;
    }
  }

  async initializeData(): Promise<{ success: boolean; message: string; source: 'backend' | 'local' }> {
    if (this.initializationAttempted) {
      return { 
        success: true, 
        message: 'Data already initialized', 
        source: this.backendAvailable ? 'backend' : 'local' 
      };
    }

    this.initializationAttempted = true;

    // First check if backend is available
    const backendHealthy = await this.checkBackendHealth();
    
    if (backendHealthy) {
      try {
        console.log('🔄 Backend is healthy, verifying data...');
        
        // Verify backend data exists
        const verification = await this.verifyBackendData();
        if (verification.success) {
          console.log('✅ Backend data verified');
          return { 
            success: true, 
            message: 'Backend data verified and ready', 
            source: 'backend' 
          };
        } else {
          console.warn('⚠️ Backend is healthy but no data found. Please run migration SQL files.');
          return {
            success: false,
            message: 'Backend has no data. Please run the migration SQL files to populate the database.',
            source: 'backend'
          };
        }
      } catch (error) {
        console.warn('⚠️ Backend verification error:', error.message);
        return {
          success: false,
          message: `Backend verification failed: ${error.message}`,
          source: 'backend'
        };
      }
    }

    // Backend unavailable
    return { 
      success: false, 
      message: 'Backend is unavailable. Please check your connection and backend configuration.', 
      source: 'local' 
    };
  }

  async verifyBackendData(): Promise<{ success: boolean; count: number }> {
    try {
      const response = await productsApi.getProducts({ limit: 1 });
      const productCount = response?.products?.length || 0;
      
      console.log(`Backend verification: ${productCount} products found`);
      
      return {
        success: productCount > 0,
        count: productCount
      };
    } catch (error) {
      console.warn('Backend verification failed:', error.message);
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
    source: 'backend' | 'local';
  }> {
    // Generate cache key
    const cacheKey = `products:${JSON.stringify(params || {})}`;
    
    // Check cache first
    const cached = this.getCached<{ products: any[]; pagination: any; source: 'backend' | 'local' }>(cacheKey);
    if (cached) {
      return cached;
    }

    // Try to fetch from backend
    try {
      const response = await productsApi.getProducts(params);
      
      if (response && response.products) {
        console.log(`✅ Got ${response.products.length} products from backend`);
        this.backendAvailable = true;
        const result = {
          ...response,
          source: 'backend' as const
        };
        this.setCache(cacheKey, result, 'backend');
        return result;
      }
    } catch (error) {
      console.error('⚠️ Backend product fetch failed:', error.message);
      this.backendAvailable = false;
      throw new Error(`Failed to fetch products from backend: ${error.message}`);
    }

    // If we reach here, backend failed and no fallback
    throw new Error('Unable to fetch products. Please check your backend connection.');
  }

  async getProduct(id: string): Promise<{ product: any | null; source: 'backend' | 'local' }> {
    // Check cache first
    const cacheKey = `product:${id}`;
    const cached = this.getCached<{ product: any | null; source: 'backend' | 'local' }>(cacheKey);
    if (cached) {
      return cached;
    }

    // Try backend
    try {
      const response = await productsApi.getProduct(id);
      if (response?.product) {
        const result = { product: response.product, source: 'backend' as const };
        this.setCache(cacheKey, result, 'backend');
        return result;
      }
      
      // Product not found
      return { product: null, source: 'backend' as const };
    } catch (error) {
      console.error('Backend product fetch failed:', error.message);
      this.backendAvailable = false;
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
      fallbackEnabled: this.options.fallbackToLocal || false
    };
  }
}

// Create a singleton instance
export const dataManager = new DataManager({
  useBackend: true,
  fallbackToLocal: false, // No fallback - show errors instead
  timeout: 8000 // 8 second timeout
});

// Legacy exports for backward compatibility
export async function checkAndInitializeData() {
  const result = await dataManager.initializeData();
  return {
    success: result.success,
    message: result.message,
    error: result.success ? null : result.message
  };
}