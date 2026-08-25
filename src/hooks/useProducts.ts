import { useState, useEffect } from "react";
import {
  getProducts,
  getProductById,
  type Product,
} from "../utils/database-service";
import { toast } from "sonner";

export interface UseProductsOptions {
  category?: string;
  subcategory?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  brand?: string;
  categoryFilter?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  inStock?: boolean;
  onSale?: boolean;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  const fetchProducts = async (fetchOptions: UseProductsOptions = {}) => {
    try {
      setLoading(true);
      setError(null);

      const page = fetchOptions.page || options.page || 1;
      const limit = fetchOptions.limit || options.limit || 12;
      const offset = (page - 1) * limit;

      const params = {
        category: fetchOptions.category || options.category,
        subcategory: fetchOptions.subcategory || options.subcategory,
        featured:
          fetchOptions.featured !== undefined
            ? fetchOptions.featured
            : options.featured,
        search: fetchOptions.search || options.search,
        limit,
        offset,
      };

      console.log("🔍 useProducts: Fetching with params:", params);
      const { data, total, error: dbError } = await getProducts(params);

      if (dbError) {
        throw new Error(dbError.message || "Failed to fetch products");
      }

      setProducts(data);

      const totalPages = Math.ceil(total / limit);
      setPagination({
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      });

      console.log(`✅ useProducts: Loaded ${data.length} of ${total} products`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch products";
      setError(errorMessage);
      console.error("❌ useProducts error:", err);

      setProducts([]);
      setPagination({
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      });

      toast.error("Unable to load products");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, []);

  // Refetch when options change
  const refetch = (newOptions?: UseProductsOptions) => {
    fetchProducts(newOptions);
  };

  return {
    products,
    loading,
    error,
    pagination,
    refetch,
  };
}

export function useProduct(productId: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔍 useProduct: Fetching product:", productId);
        const { data, error: dbError } = await getProductById(productId);

        if (dbError) {
          throw new Error(dbError.message || "Failed to fetch product");
        }

        setProduct(data);
        console.log(`✅ useProduct: Loaded product ${productId}`);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch product";
        setError(errorMessage);
        console.error("❌ useProduct error:", err);
        setProduct(null);
        toast.error("Unable to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return {
    product,
    loading,
    error,
  };
}
