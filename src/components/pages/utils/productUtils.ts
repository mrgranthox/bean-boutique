import { Coffee, coffees } from '../data/coffeeData';
import { Equipment, equipment } from '../data/equipmentData';

export type ProductType = 'coffee' | 'equipment';
export type Product = Coffee | Equipment;

// Unified product interface for common properties
export interface UnifiedProduct {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
  description: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  category: string;
  type: ProductType;
}

// Convert coffee to unified product
export const coffeeToUnified = (coffee: Coffee): UnifiedProduct => ({
  id: coffee.id,
  name: coffee.name,
  price: coffee.price,
  salePrice: coffee.salePrice,
  image: coffee.image,
  description: coffee.description,
  rating: coffee.rating,
  reviewCount: coffee.reviewCount,
  inStock: coffee.inStock,
  category: coffee.origin,
  type: 'coffee'
});

// Convert equipment to unified product
export const equipmentToUnified = (eq: Equipment): UnifiedProduct => ({
  id: eq.id,
  name: eq.name,
  price: eq.price,
  salePrice: eq.salePrice,
  image: eq.image,
  description: eq.description,
  rating: eq.rating,
  reviewCount: eq.reviewCount,
  inStock: eq.inStock,
  category: eq.category,
  type: 'equipment'
});

// Get all products (coffee + equipment)
export const getAllProducts = (): UnifiedProduct[] => {
  const coffeeProducts = coffees.map(coffeeToUnified);
  const equipmentProducts = equipment.map(equipmentToUnified);
  return [...coffeeProducts, ...equipmentProducts];
};

// Get product by ID (searches both coffee and equipment)
export const getProductById = (id: string): Product | undefined => {
  const coffee = coffees.find(c => c.id === id);
  if (coffee) return coffee;
  
  const eq = equipment.find(e => e.id === id);
  return eq;
};

// Get product type by ID
export const getProductTypeById = (id: string): ProductType | undefined => {
  if (coffees.find(c => c.id === id)) return 'coffee';
  if (equipment.find(e => e.id === id)) return 'equipment';
  return undefined;
};

// Get coffee by ID
export const getCoffeeById = (id: string): Coffee | undefined => {
  return coffees.find(c => c.id === id);
};

// Get equipment by ID
export const getEquipmentById = (id: string): Equipment | undefined => {
  return equipment.find(e => e.id === id);
};

// Search products by name or description
export const searchProducts = (query: string): UnifiedProduct[] => {
  const allProducts = getAllProducts();
  const lowercaseQuery = query.toLowerCase();
  
  return allProducts.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery)
  );
};

// Filter products by various criteria
export interface ProductFilters {
  type?: ProductType[];
  category?: string[];
  priceRange?: [number, number];
  inStock?: boolean;
  onSale?: boolean;
  rating?: number;
}

export const filterProducts = (filters: ProductFilters): UnifiedProduct[] => {
  let filteredProducts = getAllProducts();

  if (filters.type && filters.type.length > 0) {
    filteredProducts = filteredProducts.filter(p => filters.type!.includes(p.type));
  }

  if (filters.category && filters.category.length > 0) {
    filteredProducts = filteredProducts.filter(p => filters.category!.includes(p.category));
  }

  if (filters.priceRange) {
    filteredProducts = filteredProducts.filter(p => {
      const price = p.salePrice || p.price;
      return price >= filters.priceRange![0] && price <= filters.priceRange![1];
    });
  }

  if (filters.inStock !== undefined) {
    filteredProducts = filteredProducts.filter(p => p.inStock === filters.inStock);
  }

  if (filters.onSale) {
    filteredProducts = filteredProducts.filter(p => !!p.salePrice);
  }

  if (filters.rating) {
    filteredProducts = filteredProducts.filter(p => p.rating >= filters.rating!);
  }

  return filteredProducts;
};

// Sort products
export type SortOption = 'name' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'popular';

export const sortProducts = (products: UnifiedProduct[], sortBy: SortOption): UnifiedProduct[] => {
  const sortedProducts = [...products];

  switch (sortBy) {
    case 'name':
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    case 'price-low':
      return sortedProducts.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    case 'price-high':
      return sortedProducts.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    case 'rating':
      return sortedProducts.sort((a, b) => b.rating - a.rating);
    case 'popular':
      return sortedProducts.sort((a, b) => b.reviewCount - a.reviewCount);
    case 'newest':
      // For newest, we'll prioritize products marked as new/featured
      return sortedProducts.sort((a, b) => {
        const aProduct = getProductById(a.id);
        const bProduct = getProductById(b.id);
        
        const aIsNew = (aProduct as any)?.new || (aProduct as any)?.featured;
        const bIsNew = (bProduct as any)?.new || (bProduct as any)?.featured;
        
        if (aIsNew && !bIsNew) return -1;
        if (!aIsNew && bIsNew) return 1;
        return 0;
      });
    default:
      return sortedProducts;
  }
};

// Get pagination info
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const getPaginationInfo = (
  totalItems: number,
  currentPage: number,
  itemsPerPage: number
): PaginationInfo => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems - 1);

  return {
    currentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1
  };
};

// Paginate products
export const paginateProducts = (
  products: UnifiedProduct[],
  currentPage: number,
  itemsPerPage: number
): { items: UnifiedProduct[]; pagination: PaginationInfo } => {
  const pagination = getPaginationInfo(products.length, currentPage, itemsPerPage);
  const items = products.slice(pagination.startIndex, pagination.endIndex + 1);

  return { items, pagination };
};

// Get related products (same type, different product)
export const getRelatedProducts = (productId: string, limit: number = 4): UnifiedProduct[] => {
  const product = getProductById(productId);
  if (!product) return [];

  const productType = getProductTypeById(productId);
  if (!productType) return [];

  const allProducts = getAllProducts();
  const sameTypeProducts = allProducts.filter(p => 
    p.type === productType && p.id !== productId
  );

  // Prioritize products with similar categories or high ratings
  const sortedRelated = sameTypeProducts.sort((a, b) => {
    // If same category, prioritize
    const aSameCategory = a.category === (product as any).category || a.category === (product as any).origin;
    const bSameCategory = b.category === (product as any).category || b.category === (product as any).origin;
    
    if (aSameCategory && !bSameCategory) return -1;
    if (!aSameCategory && bSameCategory) return 1;
    
    // Then by rating
    return b.rating - a.rating;
  });

  return sortedRelated.slice(0, limit);
};