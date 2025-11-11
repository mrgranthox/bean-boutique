import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";

import { DynamicPagination } from "../ui/dynamic-pagination";
import { RatingDisplay } from "../ui/rating-display";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useProducts } from "../../hooks/useProducts";
import { useCart } from "../../App";
import {
  Search,
  Filter,
  X,
  ShoppingCart,
  Heart,
  Eye,
  Loader2,
} from "lucide-react";
import type { Page } from "../../App";

interface BrewingEquipmentPageProps {
  onPageChange: (
    page: Page,
    productId?: string,
    category?: "coffee" | "equipment"
  ) => void;
}

interface FilterState {
  search: string;
  category: string;
  brand: string;
  priceRange: string;
  inStock: boolean;
  onSale: boolean;
  featured: boolean;
}

export function BrewingEquipmentPage({
  onPageChange,
}: BrewingEquipmentPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedDate, setSelectedDate] = useState("All");
  const { addToCart } = useCart();

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "",
    brand: "",
    priceRange: "",
    inStock: false,
    onSale: false,
    featured: false,
  });

  // Use backend products hook
  const {
    products: backendProducts,
    loading,
    error,
    pagination,
    refetch,
  } = useProducts({
    category: "equipment",
    page: currentPage,
    limit: itemsPerPage,
    search: filters.search,
    sortBy:
      sortBy === "featured"
        ? "name"
        : sortBy === "price-low"
        ? "price"
        : sortBy === "price-high"
        ? "price"
        : sortBy,
    sortOrder: sortBy === "price-high" ? "desc" : "asc",
  });

  // Use backend products only - no fallback
  const allProducts = backendProducts;

  // Get unique values for filter options
  const categories = Array.from(
    new Set(allProducts.map((e) => e.category).filter(Boolean))
  ).sort();
  const brands = Array.from(
    new Set(allProducts.map((e) => e.brand).filter(Boolean))
  ).sort();

  // Refetch when filters change
  useEffect(() => {
    if (backendProducts.length > 0) {
      refetch({
        category: "equipment",
        page: currentPage,
        limit: itemsPerPage,
        search: filters.search || undefined,
        sortBy:
          sortBy === "featured"
            ? "name"
            : sortBy === "price-low"
            ? "price"
            : sortBy === "price-high"
            ? "price"
            : sortBy,
        sortOrder: sortBy === "price-high" ? "desc" : "asc",
      });
    }
  }, [currentPage, itemsPerPage, filters.search, sortBy]);

  // Apply filters and search
  // Default sortBy stays "featured" but featured filter remains off unless user enables it

  // Re-fetch from backend when any filter or pagination changes
  useEffect(() => {
    if (backendProducts.length > 0) {
      refetch({
        category: "equipment",
        page: currentPage,
        limit: itemsPerPage,
        search: filters.search || undefined,
        brand: filters.brand || undefined,
        priceRange: filters.priceRange || undefined,
        sortBy:
          sortBy === "featured"
            ? "name"
            : sortBy === "price-low"
            ? "price"
            : sortBy === "price-high"
            ? "price"
            : sortBy,
        sortOrder: sortBy === "price-high" ? "desc" : "asc",
      });
    }
  }, [
    currentPage,
    itemsPerPage,
    filters.search,
    filters.category,
    filters.brand,
    filters.priceRange,
    filters.inStock,
    filters.onSale,
    filters.featured,
    sortBy,
  ]);

  // Apply filters (frontend fallback)
  const filteredEquipment = useMemo(() => {
    let result = [...allProducts];

    // 🔍 Search filter
    if (filters.search.trim()) {
      const term = filters.search.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term) ||
          item.category?.toLowerCase().includes(term) ||
          item.brand?.toLowerCase().includes(term) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(term))
      );
    }

    // 🏷️ Category filter
    if (filters.category) {
      result = result.filter(
        (item) =>
          item.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // 🏭 Brand filter
    if (filters.brand) {
      result = result.filter(
        (item) => item.brand?.toLowerCase() === filters.brand.toLowerCase()
      );
    }

    // 💰 Price range
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);
      result = result.filter((item) => {
        const price = item.sale_price || item.price;
        return price >= min && price <= max;
      });
    }

    // 📦 In stock
    if (filters.inStock) {
      result = result.filter((item) => item.stock > 0);
    }

    // 🏷️ On sale
    if (filters.onSale) {
      result = result.filter((item) => !!item.sale_price);
    }

    // 🌟 Featured — only if user explicitly turns it on
    if (filters.featured) {
      result = result.filter((item) => item.featured);
    }

    return result;
  }, [filters, allProducts]);

  // Apply sorting
  const sortedEquipment = useMemo(() => {
    const sorted = [...filteredEquipment];

    switch (sortBy) {
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "price-low":
        return sorted.sort(
          (a, b) => (a.sale_price || a.price) - (b.sale_price || b.price)
        );
      case "price-high":
        return sorted.sort(
          (a, b) => (b.sale_price || b.price) - (a.sale_price || a.price)
        );
      case "rating":
        return sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      case "newest":
        return sorted.sort((a, b) => (b.created_at ?? 0) - (a.created_at ?? 0));
      case "popular":
        return sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      case "featured":
      default:
        return sorted.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          if (a.bestseller && !b.bestseller) return -1;
          if (!a.bestseller && b.bestseller) return 1;
          return (b.rating ?? 0) - (a.rating ?? 0);
        });
    }
  }, [filteredEquipment, sortBy]);

  // Calculate pagination (use backend pagination if available)
  const totalItems =
    backendProducts.length > 0 && pagination
      ? pagination.total
      : sortedEquipment.length;

  const totalPages =
    backendProducts.length > 0 && pagination
      ? pagination.totalPages
      : Math.ceil(sortedEquipment.length / itemsPerPage);

  const startIndex =
    backendProducts.length > 0 && pagination
      ? (pagination.page - 1) * pagination.limit
      : (currentPage - 1) * itemsPerPage;

  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const currentEquipment =
    backendProducts.length > 0 && pagination
      ? sortedEquipment
      : sortedEquipment.slice(startIndex, endIndex);

  // Handle filter changes
  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      brand: "",
      priceRange: "",
      inStock: false,
      onSale: false,
      featured: false,
    });
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.values(filters).some((value) =>
    Boolean(value)
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleAddToCart = async (
    item: (typeof allProducts)[0],
    e: React.MouseEvent
  ) => {
    e.stopPropagation(); // Prevent navigation to product details

    try {
      const success = await addToCart(item.id, 1);
      if (success) {
        // toast.success('Added to cart!'); // Toast is handled by the cart hook
      } else {
        console.warn("Failed to add to cart:", item.id);
      }
    } catch (error) {
      console.error("Error adding to cart:", item.id, error);
    }
  };

  const EquipmentCard = ({ item }: { item: (typeof allProducts)[0] }) => {
    const currentPrice = item.sale_price || item.price;
    const originalPrice = item.sale_price ? item.price : null;
    const discount = originalPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

    return (
      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
        <div
          className="relative aspect-square overflow-hidden rounded-t-lg"
          onClick={() => onPageChange("product-details", item.id, "equipment")}
        >
          <ImageWithFallback
            src={item.image}
            alt={item.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges */}
          {item.sale_price && (
            <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
              {discount}% OFF
            </Badge>
          )}
          {item.new && (
            <Badge className="absolute top-3 right-3 bg-green-600 text-white">
              New
            </Badge>
          )}
          {item.featured && (
            <Badge className="absolute bottom-3 left-3 bg-blue-600 text-white">
              Featured
            </Badge>
          )}
          {item.bestseller && (
            <Badge className="absolute bottom-3 right-3 bg-yellow-600 text-white">
              Best Seller
            </Badge>
          )}

          {/* Quick Action Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                onPageChange("product-details", item.id, "equipment");
              }}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            <Button
              size="sm"
              onClick={(e) => handleAddToCart(item, e)}
              disabled={!item.stock}
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>

        <CardContent
          className="p-4 cursor-pointer"
          onClick={() => onPageChange("product-details", item.id, "equipment")}
        >
          <div className="flex items-start justify-between mb-2">
            <Badge variant="secondary" className="text-xs">
              {item.category}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 text-muted-foreground hover:text-red-500"
              onClick={(e) => e.stopPropagation()}
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>

          <h3 className="mb-2 line-clamp-2">{item.name}</h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {item.description}
          </p>

          <div className="flex items-center gap-2 mb-3">
            <RatingDisplay rating={item.rating ?? 0} size="sm" />
            <span className="text-xs text-muted-foreground">
              ({item.review_count})
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{item.brand}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-primary">${currentPrice.toFixed(2)}</span>
              {originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {!item.stock && (
                <Badge variant="destructive" className="text-xs">
                  Out of Stock
                </Badge>
              )}
              {item.stock && (
                <Badge variant="outline" className="text-xs">
                  In Stock
                </Badge>
              )}
            </div>
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {item.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Show loading state
  if (loading && currentPage === 1 && allProducts.length === 0) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl mb-4">Brewing Equipment</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional-grade coffee equipment for home baristas and
              commercial use. From grinders to espresso machines, find
              everything you need to brew the perfect cup.
            </p>
          </div>
          <Card>
            <CardContent className="p-12 text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-xl mb-2">Loading equipment products...</p>
              <p className="text-muted-foreground">
                Please wait while we fetch our collection
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && allProducts.length === 0) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl mb-4">Brewing Equipment</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional-grade coffee equipment for home baristas and
              commercial use. From grinders to espresso machines, find
              everything you need to brew the perfect cup.
            </p>
          </div>
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-destructive text-6xl mb-4">⚠️</div>
              <p className="text-xl mb-2">Unable to Load Products</p>
              <p className="text-muted-foreground mb-6">
                {error ||
                  "Could not connect to the backend. Please check your connection and try again."}
              </p>
              <Button onClick={() => refetch()}>Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-4">Brewing Equipment</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional-grade coffee equipment for home baristas and commercial
            use. From grinders to espresso machines, find everything you need to
            brew the perfect cup.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Sort Bar */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search equipment..."
                      value={filters.search}
                      onChange={(e) => updateFilter("search", e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="name">Name A-Z</SelectItem>
                      <SelectItem value="price-low">
                        Price Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price High to Low
                      </SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Filter Toggle */}
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="md:w-auto"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {hasActiveFilters && (
                      <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                        !
                      </Badge>
                    )}
                  </Button>
                </div>

                {/* Expandable Filters */}
                {showFilters && (
                  <div className="mt-6 pt-6 border-t space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Category Filter */}
                      <div>
                        <label className="text-sm mb-2 block">Category</label>
                        <Select
                          value={filters.category}
                          onValueChange={(value) =>
                            updateFilter("category", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All Categories" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All Categories</SelectItem>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Brand Filter */}
                      <div>
                        <label className="text-sm mb-2 block">Brand</label>
                        <Select
                          value={filters.brand}
                          onValueChange={(value) =>
                            updateFilter("brand", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All Brands" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All Brands</SelectItem>
                            {brands.map((brand) => (
                              <SelectItem key={brand} value={brand ?? ""}>
                                {brand}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Price Range Filter */}
                      <div>
                        <label className="text-sm mb-2 block">
                          Price Range
                        </label>
                        <Select
                          value={filters.priceRange}
                          onValueChange={(value) =>
                            updateFilter("priceRange", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All Prices" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All Prices</SelectItem>
                            <SelectItem value="0-50">Under $50</SelectItem>
                            <SelectItem value="50-100">$50 - $100</SelectItem>
                            <SelectItem value="100-200">$100 - $200</SelectItem>
                            <SelectItem value="200-500">$200 - $500</SelectItem>
                            <SelectItem value="500-9999">$500+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Quick Filters */}
                      <div className="space-y-2">
                        <label className="text-sm block">Quick Filters</label>
                        <div className="space-y-1">
                          <label className="flex items-center space-x-2 text-sm">
                            <input
                              type="checkbox"
                              checked={filters.inStock}
                              onChange={(e) =>
                                updateFilter("inStock", e.target.checked)
                              }
                              className="rounded"
                            />
                            <span>In Stock Only</span>
                          </label>
                          <label className="flex items-center space-x-2 text-sm">
                            <input
                              type="checkbox"
                              checked={filters.onSale}
                              onChange={(e) =>
                                updateFilter("onSale", e.target.checked)
                              }
                              className="rounded"
                            />
                            <span>On Sale</span>
                          </label>
                          <label className="flex items-center space-x-2 text-sm">
                            <input
                              type="checkbox"
                              checked={filters.featured}
                              onChange={(e) =>
                                updateFilter("featured", e.target.checked)
                              }
                              className="rounded"
                            />
                            <span>Featured</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Clear Filters */}
                    {hasActiveFilters && (
                      <div className="flex justify-between items-center pt-4 border-t">
                        <span className="text-sm text-muted-foreground">
                          {totalItems} items found
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearFilters}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Clear All Filters
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Info */}
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">
                Showing {startIndex + 1}-
                {Math.min(startIndex + itemsPerPage, totalItems)} of{" "}
                {totalItems} items
              </p>
            </div>

            {/* Equipment Grid */}
            {currentEquipment.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentEquipment.map((item) => (
                  <EquipmentCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-xl mb-4">No equipment found</p>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters or search terms.
                  </p>
                  <Button onClick={clearFilters}>Clear All Filters</Button>
                </CardContent>
              </Card>
            )}

            {/* Pagination */}
            {totalItems > itemsPerPage && (
              <DynamicPagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                className="mt-8"
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Equipment */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4">Featured Equipment</h3>
                {allProducts.find((e) => e.featured) && (
                  <EquipmentCard item={allProducts.find((e) => e.featured)!} />
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4">Equipment Stats</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Total Items:</span>
                    <span>{allProducts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Categories:</span>
                    <span>{categories.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Brands:</span>
                    <span>{brands.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>In Stock:</span>
                    <span>{allProducts.filter((e) => e.stock).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
