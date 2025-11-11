import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import {
  Search,
  Star,
  ShoppingCart,
  Clock,
  Tag,
  Gift,
  Percent,
  Calendar,
  Loader2,
} from "lucide-react";
import { Pagination } from "../ui/pagination-custom";
import { toast } from "sonner";
import { useCart } from "../../App";
import { getOffers, getPromotions } from "../../utils/database-service";
import type { Offer, Promotion } from "../../utils/database-service";
import type { Page } from "../../App";

interface OffersPageProps {
  onPageChange: (page: Page) => void;
}

export function OffersPage({ onPageChange }: OffersPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("discount");
  const itemsPerPage = 12;
  const { addToCart } = useCart();

  const [offers, setOffers] = useState<Offer[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  // Load offers and promotions from database
  useEffect(() => {
    loadOffersAndPromotions();
  }, []);

  const loadOffersAndPromotions = async () => {
    try {
      setLoading(true);
      const [offersResult, promotionsResult] = await Promise.all([
        getOffers({ active: true }),
        getPromotions({ active: true }),
      ]);

      setOffers(offersResult.data);
      setPromotions(promotionsResult.data);

      console.log(
        `✅ Loaded ${offersResult.data.length} offers and ${promotionsResult.data.length} promotions`
      );
    } catch (error) {
      console.error("❌ Error loading offers:", error);
      toast.error("Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  const filteredOffers = useMemo(() => {
    let result = offers.filter((offer) => {
      const matchesSearch =
        (offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          offer.description) ??
        "No description available"
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    // Sort
    result.sort((a, b) => {
      if (sortBy === "discount") {
        return (b.discount_value ?? 0) - (a.discount_value ?? 0);
      } else if (sortBy === "price-low") {
        return (a.min_purchase ?? 0) - (b.min_purchase ?? 0);
      } else if (sortBy === "expiry") {
        const aTime = a.end_date ? new Date(a.end_date).getTime() : 0;
        const bTime = b.end_date ? new Date(b.end_date).getTime() : 0;
        return aTime - bTime;
      }
      return 0;
    });

    return result;
  }, [offers, searchTerm, sortBy]);

  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOffers = filteredOffers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleClaimOffer = (offer: Offer) => {
    if (offer.code) {
      navigator.clipboard
        .writeText(offer.code)
        .then(() => {
          toast.success("Discount code copied to clipboard!", {
            description: `Use code "${offer.code}" at checkout`,
          });
        })
        .catch(() => {
          toast.error("Failed to copy code. Please try again.");
        });
    } else {
      toast.success("Offer applied!");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDiscountText = (offer: Offer) => {
    if (offer.discount_percent) {
      return `${offer.discount_percent}% OFF`;
    }
    return "Special Offer";
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl mb-6">Special Offers</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Save big on premium coffee, equipment, and bundles. Limited time
            offers!
          </p>
        </section>

        {/* Featured Promotions */}
        {promotions.length > 0 && (
          <section className="mb-12">
            <div className="text-center mb-6">
              <Badge className="mb-2">Active Promotions</Badge>
              <h2 className="text-2xl">Limited Time Offers</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions.map((promo) => (
                <Card
                  key={promo.id}
                  className="overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5"
                >
                  <CardHeader>
                    <Badge className="w-fit mb-2" variant="destructive">
                      {promo.discount_type === "percentage"
                        ? `${promo.discount_value}% OFF`
                        : `$${promo.discount_value} OFF`}
                    </Badge>
                    <CardTitle>{promo.title}</CardTitle>
                    <CardDescription>
                      {promo.description || "Special promotion"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Calendar className="h-4 w-4" />
                      <span>Valid until: {formatDate(promo.end_date)}</span>
                    </div>
                    {promo.code && (
                      <div className="mb-4 p-3 bg-muted rounded-md">
                        <p className="text-xs text-muted-foreground mb-1">
                          Promo Code
                        </p>
                        <p className="font-mono font-semibold">{promo.code}</p>
                      </div>
                    )}
                    <Button
                      className="w-full"
                      onClick={() =>
                        promo.code && navigator.clipboard.writeText(promo.code)
                      }
                    >
                      {promo.code ? "Copy Code" : "Learn More"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Filters and Search */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search offers..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="discount">Best Discount</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="expiry">Expiring Soon</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Offers Grid */}
        <section className="mb-12">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : filteredOffers.length === 0 ? (
            <Card className="p-12 text-center">
              <Gift className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl mb-2">No Offers Available</h3>
              <p className="text-muted-foreground mb-6">
                Check back soon for amazing deals on coffee and equipment!
              </p>
              <Button onClick={() => onPageChange("home")}>
                Browse Products
              </Button>
            </Card>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedOffers.map((offer) => (
                  <Card
                    key={offer.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <Badge variant="destructive" className="mb-2">
                        {getDiscountText(offer)}
                      </Badge>
                      <h3 className="text-lg mb-2">{offer.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {offer.description || "Special discount offer"}
                      </p>

                      {offer.code && (
                        <div className="mb-4 p-3 bg-muted rounded-md">
                          <p className="text-xs text-muted-foreground mb-1">
                            Discount Code
                          </p>
                          <p className="font-mono font-semibold">
                            {offer.code}
                          </p>
                        </div>
                      )}

                      {offer.end_date && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                          <Calendar className="h-4 w-4" />
                          <span>Expires: {formatDate(offer.end_date)}</span>
                        </div>
                      )}

                      <Button
                        className="w-full"
                        onClick={() => handleClaimOffer(offer)}
                      >
                        <Tag className="h-4 w-4 mr-2" />
                        {offer.code ? "Copy Code" : "View Offer"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </section>

        {/* CTA Section */}
        <section className="text-center bg-muted/30 rounded-lg p-12">
          <h2 className="text-3xl mb-4">Want More Exclusive Deals?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about flash
            sales, exclusive bundles, and member-only discounts.
          </p>
          <Button size="lg">Subscribe for Exclusive Offers</Button>
        </section>
      </div>
    </div>
  );
}
