import { useState, useEffect, useCallback } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { RatingDisplay } from "../ui/rating-display";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import {
  Coffee,
  Wrench,
  Calendar,
  Star,
  ShoppingCart,
  ArrowRight,
  Award,
  Users,
  Truck,
  Heart,
  Quote,
  TrendingUp,
  Globe,
  Leaf,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useCart } from "../../App";
import { toast } from "sonner";
import {
  getProducts,
  getBanners,
  type Product as DBProduct,
} from "../../utils/database-service";
import type { Page } from "../../App";

interface HomePageProps {
  onPageChange: (
    page: Page,
    productId?: string,
    category?: "coffee" | "equipment"
  ) => void;
}

export function HomePage({ onPageChange }: HomePageProps) {
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeaturedProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🏠 HomePage: Loading featured products from database...");

      const { data, error: dbError } = await getProducts({
        featured: true,
        limit: 3,
      });

      if (dbError) {
        console.error("HomePage: Database error:", dbError);
        setError("Failed to load products");
        toast.error("Failed to load products");
        return;
      }

      if (data.length === 0) {
        console.warn(
          "HomePage: No featured products found, loading any products"
        );
        const { data: anyProducts, error: fallbackError } = await getProducts({
          limit: 3,
        });

        if (fallbackError) {
          console.error("HomePage: Fallback error:", fallbackError);
          setError("Failed to load products");
          return;
        }

        setFeaturedProducts(anyProducts || []);
      } else {
        console.log("HomePage: Loaded", data.length, "products");
        setFeaturedProducts(data);
      }
    } catch (error) {
      console.error("HomePage: Error loading products:", error);
      setError("Failed to load products");
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeaturedProducts();
  }, [loadFeaturedProducts]);

  const handleAddToCart = async (productOrId: string | any) => {
    // Extract product ID from object or use as string
    const productId =
      typeof productOrId === "object" && productOrId?.id
        ? productOrId.id
        : productOrId;

    if (!productId || typeof productId !== "string") {
      console.error("HomePage: Invalid product ID:", productOrId);
      toast.error("Invalid product");
      return;
    }

    console.log("HomePage: Attempting to add product to cart:", productId);

    try {
      const success = await addToCart(productId, 1);
      if (success) {
        toast.success("Added to cart!");
      } else {
        console.warn(
          "HomePage: Add to cart returned false for product:",
          productId
        );
        toast.error("Failed to add to cart");
      }
    } catch (error) {
      console.error("HomePage: Error adding to cart:", productId, error);
      toast.error("Failed to add to cart");
    }
  };

  const handleViewProduct = (productId: string, category: string) => {
    onPageChange(
      "product-details",
      productId,
      category.toLowerCase() as "coffee" | "equipment"
    );
  };

  const getBadgeText = (product: DBProduct) => {
    if (!product) return "New";
    if (product.sale_price && product.sale_price < product.price) return "Sale";
    if (product.featured === true) return "Best Seller";
    return "New";
  };

  const getBadgeVariant = (product: DBProduct) => {
    if (!product) return "secondary";
    if (product.sale_price && product.sale_price < product.price)
      return "destructive";
    if (product.featured === true) return "default";
    return "secondary";
  };

  const testimonials = [
    {
      name: "Sarah Thompson",
      role: "Coffee Enthusiast",
      location: "Seattle, WA",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b093?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGNvZmZlZSUyMHNob3B8ZW58MXx8fHwxNzU1OTYyNDAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      content:
        "Bean Boutique has completely transformed my morning routine. The quality is unmatched, and knowing that my purchase directly supports coffee farmers makes every cup even more meaningful.",
      rating: 5,
      product: "Ethiopian Yirgacheffe",
    },
    {
      name: "Marcus Johnson",
      role: "Small Business Owner",
      location: "Portland, OR",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBjb2ZmZWUlMjBiYXJpc3RhfGVufDF8fHx8MTc1NTk2MjQwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      content:
        "As a cafe owner, I depend on consistent quality. Bean Boutique delivers every time. Their equipment recommendations and brewing workshops have elevated our entire operation.",
      rating: 5,
      product: "Equipment & Training",
    },
    {
      name: "Lisa Chen",
      role: "Home Barista",
      location: "San Francisco, CA",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGJ1c2luZXNzfGVufDF8fHx8MTc1NTk2MjQwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      content:
        "The subscription service is a game-changer. Fresh coffee delivered exactly when I need it, and the ability to try different origins has expanded my palate beyond what I thought possible.",
      rating: 5,
      product: "Subscription Service",
    },
  ];

  const sustainabilityFeatures = [
    {
      icon: Leaf,
      title: "Carbon Neutral",
      description:
        "All operations are carbon neutral through renewable energy and offsets",
    },
    {
      icon: Heart,
      title: "Direct Trade",
      description:
        "We work directly with farmers to ensure fair prices and sustainable practices",
    },
    {
      icon: Award,
      title: "Quality Certified",
      description:
        "All our coffee is certified organic, fair trade, and sustainably sourced",
    },
    {
      icon: TrendingUp,
      title: "Community Impact",
      description:
        "Every purchase contributes to education and infrastructure in farming communities",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-coffee-dark via-coffee-medium to-coffee-light text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left l">
              <Badge className="bg-white/20 text-white mb-6">
                ☕ Premium Coffee Experience
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">
                Discover Your
                <span className="block text-amber-200">Perfect Brew</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl">
                From single-origin beans to professional brewing equipment, we
                bring you the finest coffee experience at home.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-white text-coffee-dark hover::cursor-pointer"
                  onClick={() => onPageChange("coffee")}
                >
                  <Coffee className="h-5 w-5 mr-2" />
                  Shop Coffee
                </Button>
                <Button
                  size="lg"
                  className="bg-white text-coffee-dark hover:cursor-pointer"
                  onClick={() => onPageChange("coffee")}
                >
                  <Wrench className="h-5 w-5 mr-2" />
                  Browse Equipment
                </Button>
              </div>
            </div>
            <div className="relative ">
              <div className="aspect-square rounded-full bg-gradient-to-br from-amber-200/20 to-transparent p-8">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhjb2ZmZWUlMjBjdXAlMjBzdGVhbXxlbnwxfHx8fDE3NTU3OTczNjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Coffee cup with steam"
                  className="w-full h-full object-cover rounded-full shadow-2xl"
                />
              </div>
              {/* Floating elements */}
              <div className="absolute top-10 right-10 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Star className="h-6 w-6 text-amber-200 mb-2" />
                <div className="text-sm font-medium">4.9/5 Rating</div>
                <div className="text-xs text-white/70">5000+ Reviews</div>
              </div>
              <div className="absolute bottom-10 left-10 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Truck className="h-6 w-6 text-amber-200 mb-2" />
                <div className="text-sm font-medium">Free Shipping</div>
                <div className="text-xs text-white/70">Orders over $50</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 ">
            <h2 className="text-3xl md:text-4xl mb-4">
              Why Choose Bean Boutique?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're passionate about delivering exceptional coffee experiences
              through quality products and expert knowledge.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sustainabilityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center ">
                  <CardContent className="p-8">
                    <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular coffee beans and brewing equipment,
              loved by coffee enthusiasts worldwide.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No featured products available at the moment.
              </p>
              <Button variant="outline" onClick={() => onPageChange("coffee")}>
                Browse All Products
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredProducts
                .filter((product) => product && product.id)
                .map((product) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden group hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-square relative">
                      <ImageWithFallback
                        src={product.image_url || ""}
                        alt={product.name || "Product"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge
                          variant={getBadgeVariant(product)}
                          className={
                            getBadgeText(product) === "New"
                              ? "bg-green-600"
                              : ""
                          }
                        >
                          {getBadgeText(product)}
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"></div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">
                          {product.category || "product"}
                        </Badge>
                        <RatingDisplay
                          rating={product.rating || 4.5}
                          size="sm"
                        />
                      </div>
                      <h3 className="text-lg mb-2">
                        {product.name || "Untitled Product"}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {product.description || "No description available"}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          {product.sale_price &&
                          product.sale_price < product.price ? (
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-medium text-destructive">
                                ${product.sale_price.toFixed(2)}
                              </span>
                              <span className="text-sm line-through text-muted-foreground">
                                ${product.price.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-medium">
                              ${(product.price || 0).toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              handleViewProduct(
                                product.id,
                                product.category || "coffee"
                              )
                            }
                          >
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(product.id)}
                            disabled={!product.id}
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}

          <div className="text-center mt-12 ">
            <Button
              variant="outline"
              size="lg"
              onClick={() => onPageChange("coffee")}
            >
              View All Products
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real stories from real coffee lovers who have made Bean Boutique
              part of their daily ritual.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-primary mb-4" />
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <ImageWithFallback
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{testimonial.name}</h4>
                        <RatingDisplay
                          rating={testimonial.rating}
                          size="sm"
                          showNumber={false}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.location}
                      </p>
                      <Badge variant="outline" className="text-xs mt-2">
                        {testimonial.product}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12 ">
            <p className="text-muted-foreground mb-4">
              Join thousands of satisfied customers
            </p>
            <RatingDisplay
              rating={4.9}
              size="lg"
              className="justify-center mb-2"
            />
            <p className="text-sm text-muted-foreground">
              Based on 5,000+ verified reviews
            </p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 ">
            <h2 className="text-3xl md:text-4xl mb-4">Explore Bean Boutique</h2>
            <p className="text-muted-foreground">
              Everything you need for the perfect coffee experience
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center ">
              <CardContent className="p-6">
                <Calendar className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-medium mb-2">Workshops & Events</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Learn brewing techniques from our experts
                </p>
                <Badge variant="secondary" className="mb-4">
                  150+ Events Hosted
                </Badge>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => onPageChange("events")}
                  >
                    View Events
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Coffee className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-medium mb-2">Coffee Subscriptions</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Fresh coffee delivered to your door monthly
                </p>
                <Badge variant="secondary" className="mb-4">
                  Save up to 20%
                </Badge>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => onPageChange("subscription")}
                  >
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center ">
              <CardContent className="p-6">
                <Star className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-medium mb-2">Special Offers</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Exclusive deals and limited-time promotions
                </p>
                <Badge variant="secondary" className="mb-4">
                  Up to 40% Off
                </Badge>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => onPageChange("offers")}
                  >
                    View Offers
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-medium mb-2">About Bean Boutique</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Learn about our passion for coffee
                </p>
                <Badge variant="secondary" className="mb-4">
                  Premium Quality
                </Badge>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => onPageChange("about")}
                  >
                    About Us
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl mb-4">Stay Connected</h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Get the latest coffee tips, product updates, and exclusive offers
            delivered to your inbox. Stay updated with Bean Boutique!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-md text-foreground"
            />
            <Button
              variant="secondary"
              onClick={() =>
                toast.success(
                  "Thank you for subscribing! Welcome to the Bean Boutique family."
                )
              }
            >
              Subscribe
            </Button>
          </div>
          <div className="flex items-center justify-center gap-8 text-sm text-primary-foreground/80">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Weekly brewing tips</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Exclusive offers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>New product alerts</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
