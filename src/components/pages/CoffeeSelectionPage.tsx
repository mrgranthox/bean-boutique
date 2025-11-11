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
import { CoffeeCard } from "./components/CoffeeCard";
import { useProducts } from "../../hooks/useProducts";
import { DynamicPagination } from "../ui/dynamic-pagination";
import { Coffee } from "./data/coffeeData";
import { Search, Filter, X, Loader2 } from "lucide-react";
import type { Page } from "../../App";

interface CoffeeSelectionPageProps {
  onPageChange: (
    page: Page,
    productId?: string,
    category?: "coffee" | "equipment"
  ) => void;
}

interface FilterState {
  search: string;
  origin: string;
  roastLevel: string;
  priceRange: string;
  certifications: string[];
  inStock: boolean;
  onSale: boolean;
}

export function CoffeeSelectionPage({
  onPageChange,
}: CoffeeSelectionPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    origin: "",
    roastLevel: "",
    priceRange: "",
    certifications: [],
    inStock: false,
    onSale: false,
  });

  // Use backend products hook
  const {
    products: backendProducts,
    loading,
    error,
    pagination,
    refetch,
  } = useProducts({
    category: "coffee",
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
  const origins = Array.from(
    new Set(allProducts.map((c) => c.origin).filter(Boolean))
  ).sort();
  const roastLevels = Array.from(
    new Set(allProducts.map((c) => c.roast_level).filter(Boolean))
  ).sort();
  const allCertifications = Array.from(
    new Set(allProducts.flatMap((c) => c.certification || []))
  ).sort();

  // Refetch when filters change
  useEffect(() => {
    if (backendProducts.length > 0) {
      refetch({
        category: "coffee",
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

  // Apply filters and search (client-side for non-search filters when using backend)
  const filteredCoffees = useMemo(() => {
    let result = allProducts;

    // If using backend data and only search is active, use backend filtering
    if (backendProducts.length > 0 && filters.search) {
      // Backend handles search, so use backend products
      result = backendProducts;
    } else if (backendProducts.length === 0) {
      // Fallback to client-side filtering for local data

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        result = result.filter(
          (coffee) =>
            coffee.name.toLowerCase().includes(searchLower) ||
            coffee.description.toLowerCase().includes(searchLower) ||
            (coffee.origin &&
              coffee.origin.toLowerCase().includes(searchLower)) ||
            (coffee.tastingNotes || coffee.flavor_notes || []).some(
              (note: string) => note.toLowerCase().includes(searchLower)
            )
        );
      }
    }

    // Apply other filters client-side

    // Origin filter
    if (filters.origin) {
      result = result.filter((coffee) => coffee.origin === filters.origin);
    }

    // Roast level filter
    if (filters.roastLevel) {
      result = result.filter(
        (coffee) => coffee.roast_level === filters.roastLevel
      );
    }

    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);
      result = result.filter((coffee) => {
        const price = coffee.sale_price || coffee.price;
        return price >= min && price <= max;
      });
    }

    // Certifications filter
    if (filters.certifications.length > 0) {
      result = result.filter((coffee) =>
        filters.certifications.some((cert) =>
          coffee.certification?.includes(cert)
        )
      );
    }

    // In stock filter
    if (filters.inStock) {
      result = result.filter((coffee) => coffee.stock ?? true);
    }

    // On sale filter
    if (filters.onSale) {
      result = result.filter((coffee) => coffee.sale_price);
    }

    return result;
  }, [allProducts, backendProducts, filters]);

  // Apply sorting (only for fallback data, backend handles sorting)
  const sortedCoffees = useMemo(() => {
    // If using backend data, backend handles sorting
    if (backendProducts.length > 0) {
      return filteredCoffees;
    }

    // Fallback client-side sorting for local data
    const sorted = [...filteredCoffees];

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
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "newest":
        return sorted.sort((a, b) => {
          if (a.new && !b.new) return -1;
          if (!a.new && b.new) return 1;
          return 0;
        });
      case "featured":
      default:
        return sorted.sort((a, b) => {
          // Featured first, then best sellers, then by rating
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          if (a.bestseller && !b.bestseller) return -1;
          if (!a.bestseller && b.bestseller) return 1;
          return (b.rating || 0) - (a.rating || 0);
        });
    }
  }, [filteredCoffees, sortBy, backendProducts]);

  // Calculate pagination (use backend pagination if available)
  const totalItems =
    backendProducts.length > 0 && pagination
      ? pagination.total
      : sortedCoffees.length;
  const totalPages =
    backendProducts.length > 0 && pagination
      ? pagination.totalPages
      : Math.ceil(sortedCoffees.length / itemsPerPage);
  const startIndex =
    backendProducts.length > 0 && pagination
      ? (pagination.page - 1) * pagination.limit
      : (currentPage - 1) * itemsPerPage;
  const endIndex =
    backendProducts.length > 0 && pagination
      ? Math.min(startIndex + pagination.limit, totalItems)
      : Math.min(startIndex + itemsPerPage, totalItems);
  const currentCoffees =
    backendProducts.length > 0
      ? sortedCoffees
      : sortedCoffees.slice(startIndex, endIndex);

  // Handle filter changes
  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const toggleCertification = (cert: string) => {
    setFilters((prev) => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter((c) => c !== cert)
        : [...prev.certifications, cert],
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      origin: "",
      roastLevel: "",
      priceRange: "",
      certifications: [],
      inStock: false,
      onSale: false,
    });
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.values(filters).some((value) =>
    Array.isArray(value) ? value.length > 0 : Boolean(value)
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Show loading state
  if (loading && currentPage === 1 && allProducts.length === 0) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl mb-4">Premium Coffee Selection</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our carefully curated collection of single-origin and
              specialty blend coffees, sourced directly from the world's finest
              coffee regions.
            </p>
          </div>
          <Card>
            <CardContent className="p-12 text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-xl mb-2">Loading coffee products...</p>
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
            <h1 className="text-4xl mb-4">Premium Coffee Selection</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our carefully curated collection of single-origin and
              specialty blend coffees, sourced directly from the world's finest
              coffee regions.
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
          <h1 className="text-4xl mb-4">Premium Coffee Selection</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our carefully curated collection of single-origin and
            specialty blend coffees, sourced directly from the world's finest
            coffee regions.
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
                      placeholder="Search coffees..."
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
                      {/* Origin Filter */}
                      <div>
                        <label className="text-sm mb-2 block">Origin</label>
                        <Select
                          value={filters.origin}
                          onValueChange={(value) =>
                            updateFilter("origin", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All Origins" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All Origins</SelectItem>
                            {origins.map((origin) => (
                              <SelectItem key={origin} value={origin ?? ""}>
                                {origin}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Roast Level Filter */}
                      <div>
                        <label className="text-sm mb-2 block">
                          Roast Level
                        </label>
                        <Select
                          value={filters.roastLevel}
                          onValueChange={(value) =>
                            updateFilter("roastLevel", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All Roasts" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All Roasts</SelectItem>
                            {roastLevels.map((level) => (
                              <SelectItem key={level} value={level ?? ""}>
                                {level}
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
                            <SelectItem value="0-20">Under $20</SelectItem>
                            <SelectItem value="20-30">$20 - $30</SelectItem>
                            <SelectItem value="30-50">$30 - $50</SelectItem>
                            <SelectItem value="50-100">$50 - $100</SelectItem>
                            <SelectItem value="100-999">$100+</SelectItem>
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
                        </div>
                      </div>
                    </div>

                    {/* Certifications */}
                    <div>
                      <label className="text-sm mb-2 block">
                        Certifications
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {allCertifications.map((cert) => (
                          <Badge
                            key={cert}
                            variant={
                              filters.certifications.includes(cert)
                                ? "default"
                                : "outline"
                            }
                            className="cursor-pointer"
                            onClick={() => toggleCertification(cert)}
                          >
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Clear Filters */}
                    {hasActiveFilters && (
                      <div className="flex justify-between items-center pt-4 border-t">
                        <span className="text-sm text-muted-foreground">
                          {totalItems} coffees found
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
                Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
                {totalItems} coffees
              </p>
            </div>

            {/* Coffee Grid */}
            {currentCoffees.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentCoffees.map((coffee) => {
                  const mappedCoffee: Coffee = {
                    ...coffee,
                    roastLevel:
                      (coffee.roast_level as "Light" | "Medium" | "Dark") ||
                      "Medium",
                    processingMethod: coffee.processing_method || "Unknown",
                    reviewCount: coffee.review_count ?? 0,
                    inStock: !!coffee.stock,
                    origin: coffee.origin || "Unknown",
                    rating: coffee.rating ?? 0,
                    isFairTrade: Boolean(coffee.isFairTrade),
                    isOrganic: Boolean(coffee.isOrganic),
                    tastingNotes: coffee.tastingNotes || [],
                    // add other required fields with defaults
                  };

                  return (
                    <CoffeeCard
                      key={coffee.id}
                      coffee={mappedCoffee}
                      onSelect={(id) =>
                        onPageChange("product-details", id, "coffee")
                      }
                    />
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-xl mb-4">No coffees found</p>
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
            {/* Featured Coffee */}
            {allProducts.some((c) => c.featured) && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4">Coffee of the Month</h3>
                  {(() => {
                    const featured = allProducts.find((c) => c.featured);
                    if (!featured) return null;

                    const coffee: Coffee = {
                      ...featured,
                      roastLevel:
                        (featured.roast_level as "Light" | "Medium" | "Dark") ||
                        "Medium",
                      processingMethod: featured.processing_method || "Unknown",
                      reviewCount: featured.review_count ?? 0,
                      inStock: !!featured.stock,
                      origin: featured.origin || "Unknown",
                      rating: featured.rating ?? 0,
                      isFairTrade: Boolean(featured.isFairTrade),
                      isOrganic: Boolean(featured.isOrganic),
                      tastingNotes: featured.tastingNotes || [],
                      certification: featured.certification || "",
                      // Add other required Coffee fields here if needed
                    };

                    return (
                      <CoffeeCard
                        coffee={coffee}
                        onSelect={(id) =>
                          onPageChange("product-details", id, "coffee")
                        }
                        compact
                      />
                    );
                  })()}
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            {allProducts.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4">Collection Stats</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Total Coffees:</span>
                      <span>{allProducts.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Origins:</span>
                      <span>{origins.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Organic Options:</span>
                      <span>
                        {allProducts.filter((c) => c.isOrganic).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fair Trade:</span>
                      <span>
                        {allProducts.filter((c) => c.isFairTrade).length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
